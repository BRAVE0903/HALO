// src/screens/RoleSelectionScreen.tsx
// Updated: Colors changed based on the provided palette.

import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Ensure path is correct

// Define the color palette
const PALETTE = {
    background: '#FBF6E9',
    lightAccent: '#E3F0AF',
    primary: '#5DB996',
    darkPrimary: '#118B50',
    white: '#FFFFFF',
    errorRed: '#D9534F',
    inputBorder: '#cccccc', // Kept for consistency if other screens use it
    cardBorder: '#E0E0E0', // A light grey for card borders
    textPrimary: '#333333',
    textSecondary: '#666666',
};

type RoleSelectionScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'RoleSelection'
>;

const RoleSelectionScreen = () => {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigation = useNavigation<RoleSelectionScreenNavigationProp>();

    const auth = getAuth();
    const firestore = getFirestore();
    const initialUser = auth.currentUser;

    const roles = [
        { id: 'donor', title: 'Donor', description: 'Donate some food to the needful' },
        { id: 'receiver', title: 'Receiver', description: 'Receive food donations' },
    ];

    useEffect(() => {
        if (!initialUser) {
            console.warn('No authenticated user on RoleSelectionScreen. Redirecting...');
            navigation.replace('Login');
        }
        navigation.setOptions({ headerLeft: () => null });
    }, [initialUser, navigation]);

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
            await setDoc(userDocRef, { role: selectedRole }, { merge: true });
            console.log(`Role '${selectedRole}' saved for user ${currentUser.uid}`);

            if (selectedRole === 'donor') {
                navigation.replace('DonorDetails');
            } else if (selectedRole === 'receiver') {
                 navigation.replace('ReceiverDetails');
            } else {
                 console.error("Invalid role selected:", selectedRole);
                 navigation.replace('Login');
            }
        } catch (error: any) {
            console.error("Error saving role or navigating: ", error);
            Alert.alert('Error', `Failed to process role selection: ${error.message}`);
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>Please select your primary role in the app.</Text>

                <RadioButton.Group onValueChange={newValue => setSelectedRole(newValue)} value={selectedRole}>
                    <View style={styles.rolesContainer}>
                        <Text style={styles.sectionTitle}>Choose your role</Text>
                        {roles.map((role) => (
                            <View
                                key={role.id}
                                // Apply selected style to the container for visual feedback
                                style={[
                                    styles.roleItemContainer,
                                    selectedRole === role.id && styles.selectedRoleItemContainer
                                ]}
                            >
                                <RadioButton.Item
                                    label={role.title}
                                    value={role.id}
                                    status={selectedRole === role.id ? 'checked' : 'unchecked'}
                                    onPress={() => setSelectedRole(role.id)}
                                    labelStyle={styles.roleTitle}
                                    style={styles.radioButtonItem}
                                    position="leading"
                                    color={PALETTE.primary} // Color when checked
                                    uncheckedColor={PALETTE.darkPrimary} // Color when unchecked
                                />
                                <Text style={styles.roleDescription}>{role.description}</Text>
                            </View>
                        ))}
                    </View>
                </RadioButton.Group>

                {isLoading ? (
                     <ActivityIndicator size="large" color={PALETTE.primary} style={styles.loader} />
                 ) : (
                     <TouchableOpacity
                         style={[styles.continueButton, !selectedRole ? styles.disabledButton : {}]}
                         onPress={handleContinue}
                         disabled={!selectedRole || isLoading}
                     >
                         <Text style={styles.continueButtonText}>Continue</Text>
                     </TouchableOpacity>
                 )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: PALETTE.background, // Updated background
    },
    container: {
        flex: 1,
        backgroundColor: PALETTE.background, // Updated background
        padding: 20,
    },
    title: {
        fontSize: 28, // Increased size
        fontWeight: 'bold',
        marginBottom: 10, // Adjusted margin
        textAlign: 'center',
        color: PALETTE.darkPrimary, // Updated color
    },
    subtitle: {
        fontSize: 16,
        color: PALETTE.textSecondary, // Using textSecondary from palette
        marginBottom: 30,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20, // Increased size
        fontWeight: '600',
        marginBottom: 16,
        color: PALETTE.darkPrimary, // Updated color
    },
    rolesContainer: {
        marginTop: 10, // Adjusted margin
        // flex: 1, // Can be removed if RadioButton.Group handles height
    },
    roleItemContainer: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: PALETTE.cardBorder, // Updated border color
        borderRadius: 8,
        paddingBottom: 10,
        backgroundColor: PALETTE.white, // Card background
    },
    selectedRoleItemContainer: { // Style for the selected role card
        borderColor: PALETTE.primary, // Highlight with primary color
        backgroundColor: PALETTE.lightAccent, // Use light accent for selected background
    },
    radioButtonItem: {
        paddingVertical: 8,
        // backgroundColor: 'transparent', // Ensure it's transparent if container has color
    },
    roleTitle: {
        fontSize: 18, // Increased size
        fontWeight: '500',
        color: PALETTE.textPrimary, // Updated color
    },
    roleDescription: {
        fontSize: 14,
        color: PALETTE.textSecondary, // Updated color
        paddingLeft: 50,
        paddingRight: 16,
        marginTop: -5, // Adjust to align better with RadioButton.Item's internal padding
    },
    continueButton: {
        backgroundColor: PALETTE.primary, // Updated button color
        borderRadius: 8,
        paddingVertical: 16, // Adjusted padding
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: PALETTE.lightAccent, // Use light accent for disabled
        opacity: 0.7,
    },
    continueButtonText: {
        color: PALETTE.white, // Updated text color
        fontSize: 16,
        fontWeight: '600',
    },
    loader: {
        marginTop: 20,
    }
});

export default RoleSelectionScreen;
