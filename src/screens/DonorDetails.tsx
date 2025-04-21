// src/screens/DonorDetailsScreen.tsx (CORRECTED Initialization)

import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet
} from 'react-native';

// --- Firebase JS SDK imports ---
// REMOVED: initializeApp, getApp from firebase/app
// REMOVED: firebaseConfig import
import { getAuth } from 'firebase/auth'; // We still need getAuth
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore'; // Firestore functions
// --- End Firebase imports ---

// NOTE: Styles are defined at the bottom now

// --- Types and SimplePicker Component (Keep as is) ---
type DonorCategory = 'Restaurant' | 'Bakery' | 'Individual' | 'Business/Other' | null;
type SimplePickerProps = { label: string; options: string[]; selectedValue: DonorCategory; onValueChange: (value: DonorCategory) => void; };

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
const DonorDetailsScreen = ({ navigation }: any) => {

    // State Variables (Keep as is)
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [donorCategory, setDonorCategory] = useState<DonorCategory>(null);
    const [businessName, setBusinessName] = useState<string>('');
    const [contactName, setContactName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [emailId, setEmailId] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [pinCode, setPinCode] = useState<string>('');
    const [city, setCity] = useState<string>('');

    // --- CORRECTED Service Initialization ---
    // Assume Firebase is initialized in App.tsx
    // Get instances associated with the default app
    const auth = getAuth();
    const db = getFirestore();
    // --- End Service Initialization ---

    const currentUser = auth.currentUser;

    // useEffect to load data (Keep as is)
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            console.log("No user logged in for DonorDetailsScreen");
            return;
        }
        setLoading(true);
        setError(null);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            // ... (loading logic remains the same) ...
             const data = docSnap.data();
             console.log("Fetched User Data:", data);
             if (data) {
                 setDonorCategory(data.donorCategory || null);
                 setBusinessName(data.businessName || '');
                 setContactName(data.contactName || '');
                 setMobileNumber(data.mobileNumber || '');
                 setEmailId(data.emailId || '');
                 setAddress(data.address || '');
                 setPinCode(data.pinCode || '');
                 setCity(data.city || '');
             } else {
                 setDonorCategory(null); setBusinessName(''); setContactName('');
                 setMobileNumber(''); setEmailId(''); setAddress(''); setPinCode(''); setCity('');
             }
             setLoading(false);
        }, (err) => {
            console.error("Firestore Snapshot Error:", err);
            setError("Failed to load details.");
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser, db]); // Keep db in dependency array if needed, though getFirestore() is stable

    // handleSaveChanges function (Keep as is)
    const handleSaveChanges = async () => {
        if (!currentUser) { setError('User not logged in.'); return; }
        if (!donorCategory) { setError('Please select a donor type.'); return; }
        if ((donorCategory === 'Restaurant' || donorCategory === 'Bakery' || donorCategory === 'Business/Other') && !businessName) {
             setError('Business Name is required for this donor type.'); return;
        }
         if (!mobileNumber) { setError('Mobile Number is required.'); return; }
        setSaving(true); setError(null);
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const dataToSave = {
                isDonor: true, role: 'Donor', donorCategory: donorCategory,
                businessName: businessName || null, contactName: contactName || null,
                mobileNumber: mobileNumber || null, emailId: emailId || null,
                address: address || null, pinCode: pinCode || null, city: city || null,
                profileUpdatedAt: new Date()
            };
            await setDoc(userDocRef, dataToSave, { merge: true });
            setSaving(false); Alert.alert('Success', 'Donor details saved.');
            // navigation.goBack();
        } catch (e: any) {
            setSaving(false); console.error('Error saving donor details:', e);
            setError(`Failed to save details: ${e.message}`); Alert.alert('Error', `Failed to save details: ${e.message}`);
        }
    };

    // Render Logic (Keep as is)
    if (!currentUser && !loading) return <View style={styles.container}><Text>Please log in.</Text></View>;
    if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#0096FF" /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Donor Details</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <SimplePicker label="Donor Type *" options={['Restaurant', 'Bakery', 'Individual', 'Business/Other']} selectedValue={donorCategory} onValueChange={setDonorCategory} />
             {(donorCategory === 'Restaurant' || donorCategory === 'Bakery' || donorCategory === 'Business/Other') && (
                  <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Business Name *</Text>
                      <TextInput style={styles.input} placeholder="Enter Business Name" value={businessName} onChangeText={setBusinessName} />
                  </View>
             )}
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
            <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={saving || !donorCategory}>
                {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Submit Details</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

// --- Merged Styles (Keep as is) ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8', },
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
});
// --- End Styles ---


export default DonorDetailsScreen; // Ensure default export