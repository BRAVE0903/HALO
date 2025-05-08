// src/screens/RegisterScreen.tsx
// Updated: Colors changed based on the provided palette.

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Alert,
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableOpacity // Added TouchableOpacity
    // Removed Button
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
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
    inputText: '#333333',
    placeholderText: '#999999',
    secondaryButtonText: '#777777', // For the "Already have an account?" button
};

type RegisterScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'Register'
>;

export const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const auth = getAuth();
    const firestore = getFirestore();

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Input Required', 'Please enter both email and password.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password should be at least 6 characters.');
            return;
        }
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Registration successful:', user.uid);
            const userDocRef = doc(firestore, "users", user.uid);
            // Initialize user document with email, UID, creation date, and null role
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                createdAt: new Date(),
                role: null // Role will be set in RoleSelectionScreen
            });
            console.log("User document created for:", user.uid);
            // Navigate to RoleSelectionScreen to let the user pick their role
            navigation.replace('RoleSelection'); // Use replace to prevent going back to Register
        } catch (error: any) {
            console.error("Registration failed:", JSON.stringify(error));
            let errorMessage = 'An unknown error occurred during registration.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email address is already registered.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'The email address is not valid.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={PALETTE.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
            />
            <TextInput
                style={styles.input}
                placeholder="Password (min. 6 characters)"
                placeholderTextColor={PALETTE.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
            />
            {isLoading ? (
                <ActivityIndicator size="large" color={PALETTE.primary} style={styles.loader} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        justifyContent: 'center',
        backgroundColor: PALETTE.background, // Updated background
    },
    title: {
        fontSize: 28, // Slightly larger title
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: PALETTE.darkPrimary, // Updated title color
    },
    input: {
        height: 50,
        borderColor: PALETTE.inputBorder, // Updated border color
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: PALETTE.white, // Updated input background
        fontSize: 16,
        color: PALETTE.inputText, // Updated input text color
    },
    button: { // Style for the main Register button
        backgroundColor: PALETTE.primary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10, // Space before the next button
    },
    buttonText: { // Text for the main Register button
        color: PALETTE.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: { // Style for the "Already have an account?" button
        marginTop: 15,
        paddingVertical: 10, // Slightly smaller padding
        alignItems: 'center',
    },
    secondaryButtonText: { // Text for the secondary button
        color: PALETTE.darkPrimary, // Use dark primary for link-like appearance
        fontSize: 15,
    },
    loader: {
        marginVertical: 20,
    },
    // Removed errorText style as it wasn't used, add if needed
});

export default RegisterScreen; // Assuming you want default export based on other files. If not, change to named.
