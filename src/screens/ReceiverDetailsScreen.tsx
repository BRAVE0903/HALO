// src/screens/ReceiverDetailsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig'; // Adjust path if needed
import * as Location from 'expo-location'; // Import expo-location

// --- Types ---
type ReceiverCategory = 'Trust' | 'NGO' | 'Individual' | null;
type SimplePickerProps = { label: string; options: string[]; selectedValue: ReceiverCategory; onValueChange: (value: ReceiverCategory) => void; };

// --- SimplePicker Component ---
const SimplePicker = ({ label, options, selectedValue, onValueChange }: SimplePickerProps) => (
    <View style={styles.fieldGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[ styles.pickerOption, selectedValue === option && styles.pickerOptionSelected ]}
                    onPress={() => onValueChange(option as ReceiverCategory)}
                >
                    <Text style={selectedValue === option ? styles.pickerOptionTextSelected : styles.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);
// --- End SimplePicker ---


// --- Main Screen Component ---
// Added 'route' prop for navigation params
const ReceiverDetailsScreen = ({ navigation, route }: any) => {

    // --- State Variables ---
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [receiverCategory, setReceiverCategory] = useState<ReceiverCategory>(null);
    const [receiverName, setReceiverName] = useState<string>('');
    const [contactName, setContactName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [emailId, setEmailId] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [pinCode, setPinCode] = useState<string>('');
    const [city, setCity] = useState<string>('');
    // --- Map Location State ---
    const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    // --- End State Variables ---

    // --- Initialize Firebase Services ---
    const auth = getAuth();
    const db = getFirestore();
    // --- End Service Initialization ---

    const currentUser = auth.currentUser;

    // --- useEffect to load existing receiver data ---
    useEffect(() => {
        if (!currentUser) { setLoading(false); return; }
        setLoading(true); setError(null);
        const userDocRef = doc(db, 'users', currentUser.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            const data = docSnap.data();
            console.log("Fetched User Data for Receiver:", data);
            if (data) {
                setReceiverCategory(data.receiverCategory || null);
                setReceiverName(data.receiverName || '');
                setContactName(data.contactName || '');
                setMobileNumber(data.mobileNumber || '');
                setEmailId(data.emailId || '');
                setAddress(data.address || '');
                setPinCode(data.pinCode || '');
                setCity(data.city || '');
                 // Load coordinates if previously saved
                setSelectedCoords(data.locationCoords || null); // Example field name
            } else {
                // Set defaults
                setReceiverCategory(null); setReceiverName(''); setContactName('');
                setMobileNumber(''); setEmailId(''); setAddress(''); setPinCode(''); setCity('');
                setSelectedCoords(null);
            }
            setLoading(false);
        }, (err) => {
            console.error("Firestore Snapshot Error (Receiver):", err);
            setError("Failed to load details."); setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser, db]);
    // --- End useEffect Load ---

     // --- useEffect to handle coordinates returned from MapScreen ---
    useEffect(() => {
        // Check if the route params contain selectedCoords and they are not null/undefined
        // Use optional chaining ?. for safety
        if (route.params?.selectedCoords) {
            const { latitude, longitude } = route.params.selectedCoords;
            console.log('Received Coords (Receiver):', latitude, longitude);
            setSelectedCoords({ latitude, longitude });
             // Optional: Try to reverse geocode to get address parts
            fillAddressFromCoords(latitude, longitude);

            // IMPORTANT: Clear the param so it doesn't trigger again on focus/re-render
            // Pass null or undefined explicitly
            navigation.setParams({ selectedCoords: null });
        }
    }, [route.params?.selectedCoords, navigation]); // Add navigation to dependency array
    // --- End useEffect Handle Coords ---


    // --- Map Navigation Function ---
    const handlePinLocation = () => {
         if (!route || !route.name) {
            console.error("Route information is not available to determine return route.");
            Alert.alert("Error", "Cannot open map, navigation context missing.");
            return;
        }
        navigation.navigate('MapScreen', {
             returnRoute: route.name, // Pass current route name ('ReceiverDetails')
             initialCoords: selectedCoords // Pass current coords to center map initially
        });
    };
    // --- End Map Navigation ---

    // --- Optional: Reverse Geocode Function ---
     const fillAddressFromCoords = async (latitude: number, longitude: number) => {
        setLoading(true); // Indicate activity
        try {
             // Make sure permissions are still granted
            let { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
                 Alert.alert("Permission Denied", "Location permission is needed to fetch address details.");
                 setLoading(false);
                 return;
            }
            let addressParts = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (addressParts && addressParts.length > 0) {
                const addr = addressParts[0];
                 console.log('Reverse Geocoded Address (Receiver):', addr);
                 // Update state - Adjust field names as needed
                setAddress(`${addr.streetNumber || ''} ${addr.street || ''}`.trim());
                setCity(addr.city || addr.district || addr.subregion || '');
                setPinCode(addr.postalCode || '');
            } else {
                  Alert.alert("Address Not Found", "Could not find address details for the selected location.");
            }
        } catch (error) {
            console.error("Reverse geocoding failed (Receiver):", error);
            Alert.alert("Error", "Could not fetch address details for the selected location.");
        } finally {
             setLoading(false);
        }
    };
     // --- End Reverse Geocode ---


    // --- handleSaveChanges to save receiver data ---
    const handleSaveChanges = async () => {
        if (!currentUser) { setError('User not logged in.'); return; }
        if (!receiverCategory) { setError('Please select a receiver type.'); return; }
        if (!receiverName) { setError('Receiver Name is required.'); return; }
        if (!mobileNumber) { setError('Mobile Number is required.'); return; }
        // Add more validation as needed...

        setSaving(true); setError(null);

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            // Data structure to save - saving receiver fields to user doc
            const dataToSave = {
                role: 'Receiver', // Explicitly setting role
                receiverCategory: receiverCategory,
                receiverName: receiverName || null,
                contactName: contactName || null,
                mobileNumber: mobileNumber || null,
                emailId: emailId || null,
                address: address || null,
                pinCode: pinCode || null,
                city: city || null,
                locationCoords: selectedCoords || null, // Save coordinates
                profileUpdatedAt: new Date()
            };

            await setDoc(userDocRef, dataToSave, { merge: true });
            setSaving(false);
            Alert.alert('Success', 'Receiver details saved.');
            // navigation.navigate('ReceiverDashboard'); // Example navigation

        } catch (e: any) {
            setSaving(false); console.error('Error saving receiver details:', e);
            setError(`Failed to save details: ${e.message}`);
            Alert.alert('Error', `Failed to save details: ${e.message}`);
        }
    };
    // --- End handleSaveChanges ---

    // --- Render Logic ---
    if (!currentUser && !loading) return <View style={styles.container}><Text>Please log in.</Text></View>;
    // Show full screen loader initially or when geocoding
    if (loading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#0096FF" /></View>;


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Receiver Details</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <SimplePicker
                label="Receiver Type *"
                options={['Trust', 'NGO', 'Individual']}
                selectedValue={receiverCategory}
                onValueChange={setReceiverCategory}
            />

            {/* --- Fields based on image --- */}
             <View style={styles.fieldGroup}>
                <Text style={styles.label}>Receiver Name *</Text>
                <TextInput style={styles.input} placeholder="Enter Trust/NGO/Individual Name" value={receiverName} onChangeText={setReceiverName} />
            </View>
             <View style={styles.fieldGroup}>
                <Text style={styles.label}>Contact Name (Optional)</Text>
                <TextInput style={styles.input} placeholder="Enter Contact Person Name" value={contactName} onChangeText={setContactName} />
            </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mobile Number *</Text>
                <TextInput style={styles.input} placeholder="Enter Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" maxLength={15}/>
            </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Id (Optional)</Text>
                <TextInput style={styles.input} placeholder="Enter Contact Email" value={emailId} onChangeText={setEmailId} keyboardType="email-address" autoCapitalize="none"/>
            </View>
             <View style={styles.fieldGroup}>
                <Text style={styles.label}>Address (Optional)</Text>
                <TextInput style={styles.input} placeholder="Enter Full Address" value={address} onChangeText={setAddress} multiline />
            </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Pin Code (Optional)</Text>
                <TextInput style={styles.input} placeholder="Enter Pin Code" value={pinCode} onChangeText={setPinCode} keyboardType="numeric" maxLength={6} />
            </View>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>City (Optional)</Text>
                <TextInput style={styles.input} placeholder="Enter City" value={city} onChangeText={setCity} />
            </View>
            {/* --- End Fields --- */}

             {/* --- Map Button --- */}
            <TouchableOpacity style={styles.pinButton} onPress={handlePinLocation}>
                <Text style={styles.pinButtonText}>Pin Location by map</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={saving || !receiverCategory || !receiverName}>
                {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Submit Details</Text>}
            </TouchableOpacity>

        </ScrollView>
    );
};


// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8', },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8'}, // Added for loading
    contentContainer: { padding: 20, paddingBottom: 60 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333', },
    fieldGroup: { marginBottom: 15, },
    input: { height: 50, width: '100%', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, backgroundColor: '#fff', fontSize: 16, },
    button: { height: 50, width: '100%', backgroundColor: '#0096FF', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    label: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#333' },
    errorText: { color: 'red', marginBottom: 15, textAlign: 'center', fontSize: 14, },
    pickerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    pickerOption: { paddingVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, marginRight: 10, marginBottom: 10, backgroundColor: '#fff', },
    pickerOptionSelected: { backgroundColor: '#E6F4FF', borderColor: '#0096FF' },
    pickerOptionText: { color: '#333' },
    pickerOptionTextSelected: { color: '#0096FF', fontWeight: 'bold' },
    // Added Pin Button Styles
     pinButton: {
        height: 50,
        width: '100%',
        borderColor: '#0096FF',
        borderWidth: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
    },
    pinButtonText: {
        color: '#0096FF',
        fontSize: 16,
        fontWeight: '600',
    },
});
// --- End Styles ---

export default ReceiverDetailsScreen;