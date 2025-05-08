// src/screens/DonorDetailsScreen.tsx
// Updated: Removed Map Button and related location logic.

import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig'; // Adjust path if needed
// Removed expo-location import as it's no longer needed here
// import * as Location from 'expo-location';

// --- Types ---
type DonorCategory = 'Restaurant' | 'Bakery' | 'Individual' | 'Business' | null;
type SimplePickerProps = { label: string; options: string[]; selectedValue: DonorCategory; onValueChange: (value: DonorCategory) => void; };

// --- SimplePicker Component ---
const SimplePicker = ({ label, options, selectedValue, onValueChange }: SimplePickerProps) => (
    <View style={styles.fieldGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={[ styles.pickerOption, selectedValue === option && styles.pickerOptionSelected ]}
                    onPress={() => onValueChange(option as DonorCategory)}
                >
                    <Text style={selectedValue === option ? styles.pickerOptionTextSelected : styles.pickerOptionText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);
// --- End SimplePicker ---

// --- Main Screen Component ---
// Removed 'route' prop as it's no longer needed for map params
const DonorDetailsScreen = ({ navigation }: any) => {

    // --- State Variables ---
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [donorCategory, setDonorCategory] = useState<DonorCategory>(null);
    const [donorName, setDonorName] = useState<string>('');
    const [contactName, setContactName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [emailId, setEmailId] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [pinCode, setPinCode] = useState<string>('');
    const [city, setCity] = useState<string>('');
    // Removed selectedCoords state
    // --- End State Variables ---

    // --- Initialize Firebase Services ---
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;
    // --- End Service Initialization ---


    // --- useEffect to load existing donor data ---
    useEffect(() => {
        if (!currentUser) { setLoading(false); return; }
        setLoading(true); setError(null);
        const userDocRef = doc(db, 'users', currentUser.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            const data = docSnap.data();
            if (data) {
                setDonorCategory(data.donorCategory || null);
                setDonorName(data.donorName || '');
                setContactName(data.contactName || '');
                setMobileNumber(data.mobileNumber || '');
                setEmailId(data.emailId || '');
                setAddress(data.address || ''); // Still load address if saved manually
                setPinCode(data.pinCode || ''); // Still load pinCode if saved manually
                setCity(data.city || '');       // Still load city if saved manually
                // Removed loading locationCoords
            } else {
                setDonorCategory(null); setDonorName(''); setContactName('');
                setMobileNumber(''); setEmailId(''); setAddress(''); setPinCode(''); setCity('');
                // Removed resetting selectedCoords
            }
            setLoading(false);
        }, (err) => {
            console.error("Firestore Snapshot Error (Donor):", err);
            setError("Failed to load details."); setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser, db]);
    // --- End useEffect Load ---

    // --- Removed useEffect for handling map coordinates ---


    // --- Removed Map Navigation Function ---


    // --- Removed Reverse Geocode Function ---


    // --- handleSaveChanges to save donor data ---
    const handleSaveChanges = async () => {
        if (!currentUser) { setError('User not logged in.'); return; }
        // Validation
        if (!donorCategory) { setError('Please select a donor type.'); return; }
        if (!donorName) { setError('Donor Name is required.'); return; }
        if (!mobileNumber) { setError('Mobile Number is required.'); return; }

        setSaving(true); setError(null);

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            // Data structure (removed locationCoords)
            const dataToSave = {
                role: 'Donor',
                donorCategory: donorCategory,
                donorName: donorName || null,
                contactName: contactName || null,
                mobileNumber: mobileNumber || null,
                emailId: emailId || null,
                address: address || null,
                pinCode: pinCode || null,
                city: city || null,
                // locationCoords: selectedCoords || null, // Removed
                profileUpdatedAt: new Date()
            };

            await setDoc(userDocRef, dataToSave, { merge: true });

            setSaving(false);
            Alert.alert(
                'Success',
                'Donor details saved.',
                [ { text: "OK", onPress: () => navigation.popToTop() } ], // Navigate back to Login on OK
                { cancelable: false }
            );

        } catch (e: any) {
            setSaving(false); console.error('Error saving donor details:', e);
            setError(`Failed to save details: ${e.message}`);
            Alert.alert('Error', `Failed to save details: ${e.message}`);
        }
    };
    // --- End handleSaveChanges ---

    // --- Render Logic ---
    if (loading) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#0096FF" /></View>;
    if (!currentUser && !loading) return <View style={styles.container}><Text>Please log in.</Text></View>;


    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Donor Details</Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Donor Picker */}
            <SimplePicker
                label="Donor Type *"
                options={['Restaurant', 'Bakery', 'Individual', 'Business']}
                selectedValue={donorCategory}
                onValueChange={setDonorCategory}
            />

            {/* Donor Fields */}
             <View style={styles.fieldGroup}>
                <Text style={styles.label}>Donor Name *</Text>
                <TextInput style={styles.input} placeholder="Enter Donor Name" value={donorName} onChangeText={setDonorName} />
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
            {/* End Fields */}

            {/* --- Removed Map Button --- */}

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={saving || !donorCategory || !donorName}>
                {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Submit Details</Text>}
            </TouchableOpacity>

        </ScrollView>
    );
};


// --- Styles ---
// Removed pinButton styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8', },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8'},
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
    // pinButton styles removed
});
// --- End Styles ---

export default DonorDetailsScreen;
