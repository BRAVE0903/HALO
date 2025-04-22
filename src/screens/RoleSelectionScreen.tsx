// src/screens/RoleSelectionScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView
} from 'react-native';
import { Checkbox } from 'react-native-paper';
// --- Firebase Imports ---
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
// --- Navigation Imports ---
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Ensure path is correct
import { AuthStackParamList } from '../navigation/AuthNavigator';

// Define navigation prop type
type RoleSelectionScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'RoleSelection'
>;

// Component function
const RoleSelectionScreen = () => {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigation = useNavigation<RoleSelectionScreenNavigationProp>();

    // --- Initialize Firebase ---
    const auth = getAuth();
    const firestore = getFirestore();
    const initialUser = auth.currentUser;

    // Roles data
    const roles = [
        { id: 'donor', title: 'Donor', description: 'Donate some food to the needful' },
        { id: 'receiver', title: 'Receiver', description: 'Pickup and deliver food to the needful' },
        { id: 'volunteer', title: 'Volunteer', description: 'Pickup and deliver food to the needful' }
    ];

    // Check user status and configure header
    useEffect(() => {
        if (!initialUser) {
            console.warn('No authenticated user on RoleSelectionScreen. Redirecting...');
            navigation.replace('Login');
        }
        navigation.setOptions({ headerLeft: () => null }); // Hide back button
    }, [initialUser, navigation]);

    // Function to save role and navigate
    const handleContinue = async () => {
        const currentUser = auth.currentUser;
        if (!selectedRole) {
             Alert.alert('Role Required', 'Please choose a role to continue.');
             return;
        }
        if (!currentUser) {
            Alert.alert('Authentication Error', 'Please log in again.');
            navigation.replace('Login');
            return;
        }

        setIsLoading(true);
        try {
            const userDocRef = doc(firestore, 'users', currentUser.uid);
            // Save the selected role itself
            await setDoc(userDocRef, { role: selectedRole }, { merge: true });
            console.log(`Role '${selectedRole}' saved for user ${currentUser.uid}`);

            // --- UPDATED NAVIGATION LOGIC ---
            if (selectedRole === 'donor') {
                navigation.replace('DonorDetails'); // Go to Donor Details
            } else if (selectedRole === 'receiver') {
                 navigation.replace('ReceiverDetails'); // Go to Receiver Details
            } else if (selectedRole === 'volunteer') {
                 // Navigate to volunteer screen or dashboard (Needs creation)
                 Alert.alert("Setup Complete", "Volunteer role selected. Next screen TBD.");
                 // Example: Replace 'DonorDetails' with 'VolunteerDashboard' or 'Home' once created
                 navigation.replace('DonorDetails'); // Placeholder navigation
            } else {
                 // Fallback navigation if needed
                 navigation.replace('DonorDetails'); // Placeholder navigation
            }
            // --- END UPDATED NAVIGATION LOGIC ---

        } catch (error: any) {
            console.error("Error saving role or navigating: ", error);
            Alert.alert('Error', `Failed to process role selection: ${error.message}`);
            setIsLoading(false); // Stop loading on error
        }
        // No setIsLoading(false) needed on success because screen is replaced
    };

    // Component JSX (Copied from previous version)
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>Please select your primary role in the app.</Text>
                <View style={styles.rolesContainer}>
                    <Text style={styles.sectionTitle}>Choose your role</Text>
                    {roles.map((role) => (
                        <TouchableOpacity key={role.id} style={[ styles.roleCard, selectedRole === role.id && styles.selectedRole ]} onPress={() => setSelectedRole(role.id)} >
                            <View style={styles.checkboxContainer}>
                                <Checkbox status={selectedRole === role.id ? 'checked' : 'unchecked'} color="#0096FF" />
                                <View>
                                    <Text style={styles.roleTitle}>{role.title}</Text>
                                    <Text style={styles.roleDescription}>{role.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                {isLoading ? (
                     <ActivityIndicator size="large" color="#0096FF" style={styles.loader} />
                 ) : (
                     <TouchableOpacity style={[styles.continueButton, !selectedRole ? styles.disabledButton : {}]} onPress={handleContinue} disabled={!selectedRole || isLoading} >
                         <Text style={styles.continueButtonText}>Continue</Text>
                     </TouchableOpacity>
                 )}
            </View>
        </SafeAreaView>
    );
};

// Styles (Copied from previous version)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff', },
    container: { flex: 1, backgroundColor: '#fff', padding: 20, },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center', },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, },
    rolesContainer: { marginTop: 20, flex: 1, },
    roleCard: { borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8, padding: 16, marginBottom: 12, },
    selectedRole: { borderColor: '#0096FF', backgroundColor: '#F0F9FF', },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', },
    roleTitle: { fontSize: 16, fontWeight: '500', marginBottom: 4, },
    roleDescription: { fontSize: 14, color: '#666', },
    continueButton: { backgroundColor: '#0096FF', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 20, },
    disabledButton: { backgroundColor: '#B0DFFF', },
    continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', },
    loader: { marginTop: 20, }
});

// Use default export
export default RoleSelectionScreen;