// src/screens/ForgotPasswordScreen.tsx
// Updated: UI adjusted to match example image and colors applied.

import React, { useState } from 'react';
import {
    View, TextInput, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView // Added SafeAreaView
} from 'react-native';

// Firebase JS SDK imports
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig'; // Adjust path if needed

// Define the color palette
const PALETTE = {
    background: '#FBF6E9', // Using the light background
    lightAccent: '#E3F0AF',
    primary: '#5DB996',     // Using the palette's primary green for the button
    darkPrimary: '#118B50', // Using dark green for title/text
    white: '#FFFFFF',
    errorRed: '#D9534F',
    successGreen: '#28A745',
    inputBorder: '#cccccc', // Keeping a neutral border
    inputText: '#333333',
    placeholderText: '#999999',
    textSecondary: '#555555', // Added a secondary text color
};


const ForgotPasswordScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Initialize Firebase Services
    let app;
    try { app = getApp(); } catch (e) { app = initializeApp(firebaseConfig); }
    const auth = getAuth(app);

    const handlePasswordReset = async () => {
        if (!email) { setError('Please enter your email address.'); return; }
        setLoading(true); setError(null); setSuccess(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setLoading(false);
            const successMessage = 'Password reset email sent! Please check your inbox (and spam folder).';
            setSuccess(successMessage);
            Alert.alert('Email Sent', 'Check email for reset instructions.');
            // Optional: Navigate back after success
            // setTimeout(() => navigation.goBack(), 2000);

        } catch (e: any) {
            setLoading(false);
            console.error("Password Reset FAILED - Raw Error:", e);
            let errorMessage = 'An unknown error occurred.';
            if (e.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
            else if (e.code === 'auth/invalid-email') errorMessage = 'Invalid email address!';
            else if (e.code === 'auth/network-request-failed') errorMessage = 'Network error.';
            else errorMessage = `Failed: ${e.message}`;
            setError(errorMessage);
        }
    };

    return (
        // Use SafeAreaView for better handling of notches/status bars
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Forgot password?</Text>
                <Text style={styles.subtitle}>
                    We will send you a message to set or reset your new password
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email Address" // Updated placeholder
                    placeholderTextColor={PALETTE.placeholderText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                 />
                {error && <Text style={styles.errorText}>{error}</Text>}
                {success && <Text style={styles.successText}>{success}</Text>}

                {loading ? (
                    <ActivityIndicator size="large" color={PALETTE.primary} style={styles.loader} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                        <Text style={styles.buttonText}>Send Email</Text> {/* Updated button text */}
                    </TouchableOpacity>
                )}

                {/* Removed "Back to Login" link */}
            </View>
        </SafeAreaView>
    );
};

// Updated styles to match the example UI
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: PALETTE.background, // Background for safe area
    },
    container: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        padding: 30, // Increased padding
        backgroundColor: PALETTE.background,
    },
    title: {
        fontSize: 28, // Larger title
        fontWeight: 'bold',
        marginBottom: 15, // Space below title
        textAlign: 'center',
        color: PALETTE.darkPrimary, // Dark green title
    },
    subtitle: {
        fontSize: 15,
        color: PALETTE.textSecondary, // Softer color for subtitle
        textAlign: 'center',
        marginBottom: 40, // More space below subtitle
        paddingHorizontal: 10, // Add padding if text wraps
    },
    input: {
        height: 55, // Slightly taller input
        width: '100%',
        borderColor: PALETTE.inputBorder,
        borderWidth: 1,
        borderRadius: 10, // More rounded corners
        paddingHorizontal: 15,
        marginBottom: 25, // More space below input
        backgroundColor: PALETTE.white,
        fontSize: 16,
        color: PALETTE.inputText,
    },
    button: {
        height: 55, // Taller button
        width: '100%',
        backgroundColor: PALETTE.primary, // Use palette primary green
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30, // Very rounded corners like example
        marginTop: 20, // Space above button
        elevation: 2, // Subtle shadow (Android)
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    buttonText: {
        color: PALETTE.white,
        fontSize: 17, // Slightly larger text
        fontWeight: '600', // Semi-bold
    },
    errorText: {
        color: PALETTE.errorRed,
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    successText: {
        color: PALETTE.successGreen,
        marginBottom: 10,
        textAlign: 'center',
        width: '100%',
    },
    // Removed linkButton and linkText styles
    loader: {
        marginVertical: 20,
    }
});

export default ForgotPasswordScreen;


