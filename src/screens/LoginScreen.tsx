// src/screens/LoginScreen.tsx
// Updated: Fetches user data from Firestore and navigates to Homepage on success.

import React, { useState } from 'react';
import {
    View, TextInput, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet
} from 'react-native';

// Firebase JS SDK imports
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// --- ADDED Firestore imports ---
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// --- End Firestore imports ---
import { firebaseConfig } from '../firebaseConfig'; // Adjust path if needed

import LoginStyles from '../styles/LoginStyles'; // Your styles import

const LoginScreen = ({ navigation }: any) => { // Ensure navigation prop is received

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize Firebase Services
    let app;
    try { app = getApp(); } catch (e) { app = initializeApp(firebaseConfig); }
    const auth = getAuth(app);
    // --- ADDED: Initialize Firestore ---
    const db = getFirestore(app);
    // --- End Firestore Init ---


    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        console.log("Attempting login with email:", email);
        setLoading(true);
        setError(null);

        try {
            // 1. Sign in with Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed in!', user.email, user.uid);

            // 2. Fetch User Data from Firestore
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("Fetched Firestore user data:", userData);

                    // Determine display name (adapt logic based on your actual fields)
                    // Prioritize a specific name field if you add one, otherwise check role-based names
                    const displayName = userData.displayName || userData.donorName || userData.receiverName || user.email || 'User'; // Fallback logic
                    const userRole = userData.role || 'Unknown Role'; // Get role, default if missing

                    setLoading(false); // Stop loading indicator

                    // 3. Navigate to Homepage with data, resetting the stack
                    navigation.reset({
                        index: 0, // Make Homepage the first and only screen in the stack
                        routes: [{
                            name: 'Homepage', // Ensure this name matches your navigator screen name
                            params: { name: displayName, role: userRole }, // Pass data as params
                        }],
                    });

                } else {
                    // Document doesn't exist - might happen if registration didn't create it
                    console.error("Firestore document not found for user:", user.uid);
                    setLoading(false);
                    setError("Could not load user profile data.");
                    Alert.alert("Login Error", "Could not load user profile data. Please try again later.");
                    // Decide if you still want to navigate or stay here
                    // Maybe navigate to a profile completion screen?
                    // For now, we stay on Login with error.
                }
            } else {
                // Should not happen if signInWithEmailAndPassword succeeded, but good practice
                throw new Error("User authentication succeeded but user object is null.");
            }

        } catch (e: any) {
            setLoading(false);
            console.error("LOGIN FAILED - Raw Error Object:", e);
            console.error("LOGIN FAILED - Error Code:", e.code);
            console.error("LOGIN FAILED - Error Message:", e.message);

            let errorMessage = 'An unknown error occurred during login.';
            if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
                 errorMessage = 'Invalid email or password.';
            } else if (e.code === 'auth/invalid-email') {
                 errorMessage = 'That email address is invalid!';
             } else if (e.code === 'auth/network-request-failed') {
                 errorMessage = 'Network error. Please check connection.';
             } else {
                 // Handle specific Firestore errors if needed during getDoc
                 errorMessage = `Login failed: ${e.message}`;
             }
            setError(errorMessage);
        }
    };

    return (
        <View style={LoginStyles.container}>
            <TextInput
                style={LoginStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={LoginStyles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error && <Text style={LoginStyles.errorText}>{error}</Text>}

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }}/>
            ) : (
                <TouchableOpacity style={[LoginStyles.button, {marginTop: 10}]} onPress={handleLogin}>
                    <Text style={LoginStyles.buttonText}>Login</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
             <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                 <Text style={styles.link}>Forgot Password?</Text>
             </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    color: '#007BFF',
    textAlign: 'center',
    padding: 5
  }
});

export default LoginScreen;