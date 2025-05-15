// src/screens/RoleSelectionScreen.tsx
// Updated: Colors changed based on the provided palette.
// Updated: "Receiver" role now navigates to Homepage.tsx.
// Refined: Minor adjustment to handle unexpected role in handleContinue.

import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { getAuth, User } from 'firebase/auth'; // Import User type for currentUser
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
    inputBorder: '#cccccc',
    cardBorder: '#E0E0E0',
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
    // Get current user when component mounts/updates, not just once
    // const initialUser: User | null = auth.currentUser; // Can be used for initial check

    const roles = [
        { id: 'donor', title: 'Donor', description: 'Donate some food to the needful' },
        { id: 'receiver', title: 'Receiver', description: 'Receive food donations' },
    ];

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                console.warn('No authenticated user on RoleSelectionScreen during auth state change. Redirecting to Login...');
                navigation.replace('Login');
            }
        });
        // Check initial user state as well
        if (!auth.currentUser) {
            console.warn('No authenticated user on RoleSelectionScreen (initial check). Redirecting to Login...');
            navigation.replace('Login');
        }

        // Prevent going back from role selection
        navigation.setOptions({ headerLeft: () => null, gestureEnabled: false });
        
        return unsubscribe; // Cleanup subscription on unmount
    }, [navigation, auth]);

    const handleContinue = async () => {
        const currentUser: User | null = auth.currentUser; // Get the most current user state
        if (!selectedRole) {
            Alert.alert('Role Required', 'Please choose a role to continue.');
            return;
        }
        if (!currentUser) {
            Alert.alert('Authentication Error', 'User session not found. Please log in again.');
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
                const homepageParams = {
                    name: currentUser.displayName || 'User', // Use displayName or a default
                    role: 'receiver', // Set role to receiver
                };
                console.log("RoleSelectionScreen: Navigating to Homepage with params:", homepageParams);
                navigation.replace('Homepage', homepageParams);
            } else {
                // This case handles an unexpected role value if `selectedRole` is somehow
                // set to something not 'donor' or 'receiver'.
                console.error("Unexpected role selected:", selectedRole);
                Alert.alert('Error', 'An unexpected error occurred with role selection. Please select a role and try again.');
                setSelectedRole(''); // Optionally reset the selection
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error("Error saving role or navigating: ", error);
            Alert.alert('Error', `Failed to process role selection: ${error.message}`);
            setIsLoading(false);
        }
        // Note: setIsLoading(false) is not called after successful navigation.replace()
        // because the component will unmount. It's correctly placed in error paths.
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
                                    color={PALETTE.primary}
                                    uncheckedColor={PALETTE.textSecondary} // Softer unchecked color
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
                        style={[
                            styles.continueButton,
                            (!selectedRole || isLoading) ? styles.disabledButton : {} // Disable if no role or loading
                        ]}
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
        backgroundColor: PALETTE.background,
    },
    container: {
        flex: 1,
        backgroundColor: PALETTE.background,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: PALETTE.darkPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: PALETTE.textSecondary,
        marginBottom: 40,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: PALETTE.textPrimary,
        textAlign: 'center',
    },
    rolesContainer: {
        // marginBottom: 20, // Add some space before the button
    },
    roleItemContainer: {
        marginBottom: 15,
        borderWidth: 1.5,
        borderColor: PALETTE.cardBorder,
        borderRadius: 12,
        paddingBottom: 12,
        backgroundColor: PALETTE.white,
        overflow: 'hidden',
    },
    selectedRoleItemContainer: {
        borderColor: PALETTE.primary,
        backgroundColor: PALETTE.lightAccent,
        elevation: 3,
        shadowColor: PALETTE.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    radioButtonItem: {
        paddingVertical: 10,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PALETTE.textPrimary,
        marginLeft: 8,
    },
    roleDescription: {
        fontSize: 14,
        color: PALETTE.textSecondary,
        paddingLeft: 52, // Aligns with RadioButton.Item's label area
        paddingRight: 16,
        marginTop: -8, // Adjust based on font/line-height
        lineHeight: 20,
    },
    continueButton: {
        backgroundColor: PALETTE.primary,
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 30,
        elevation: 2,
        shadowColor: PALETTE.darkPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    disabledButton: {
        backgroundColor: PALETTE.inputBorder, // A more visually distinct disabled state
    },
    continueButtonText: {
        color: PALETTE.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 30,
    }
});

export default RoleSelectionScreen;