// src/screens/LoginScreen.tsx
// Updated: Layered splash-icon.png behind logo.png

import React, { useState } from 'react';
import {
    View, TextInput, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Image
} from 'react-native';

// Firebase JS SDK imports
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig'; // Adjust path if needed

// import LoginStyles from '../styles/LoginStyles'; // Your styles import (can be removed if local styles cover everything)

// Define the color palette
const PALETTE = {
    background: '#FBF6E9', // Lightest, main background
    lightAccent: '#E3F0AF', // Light green/yellow
    primary: '#5DB996',     // Teal/Green - for buttons, active elements
    darkPrimary: '#118B50', // Dark Green - for text, links, or darker accents
    white: '#FFFFFF',
    errorRed: '#D9534F', // A standard error red
    inputBorder: '#cccccc', // A neutral border for inputs
    inputText: '#333333', // Standard dark text for inputs
    placeholderText: '#999999',
};

const LoginScreen = ({ navigation }: any) => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize Firebase Services
    let app;
    try { app = getApp(); } catch (e) { app = initializeApp(firebaseConfig); }
    const auth = getAuth(app);
    const db = getFirestore(app);


    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        console.log("Attempting login with email:", email);
        setLoading(true);
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed in!', user.email, user.uid);

            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("Fetched Firestore user data:", userData);
                    const displayName = userData.displayName || userData.donorName || userData.receiverName || user.email || 'User';
                    const userRole = userData.role || 'Unknown Role';
                    setLoading(false);
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'Homepage',
                            params: { name: displayName, role: userRole },
                        }],
                    });
                } else {
                    console.error("Firestore document not found for user:", user.uid);
                    setLoading(false);
                    setError("Could not load user profile data.");
                    Alert.alert("Login Error", "Could not load user profile data. Please try again later.");
                }
            } else {
                throw new Error("User authentication succeeded but user object is null.");
            }
        } catch (e: any) {
            setLoading(false);
            console.error("LOGIN FAILED - Raw Error Object:", e);
            let errorMessage = 'An unknown error occurred during login.';
            if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password.';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'That email address is invalid!';
            } else if (e.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check connection.';
            } else {
                errorMessage = `Login failed: ${e.message}`;
            }
            setError(errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            {/* --- MODIFIED: Logo Container for Layering --- */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/splash-icon.png')} // Background image
                    style={styles.splashIcon}
                    resizeMode="contain" // Or "cover" depending on the desired effect
                />
                <Image
                    source={require('../../assets/logo.png')} // Foreground image
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            {/* --- END Logo Container --- */}

            <Text style={styles.welcomeTitle}>Welcome</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={PALETTE.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={PALETTE.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            {loading ? (
                <ActivityIndicator size="large" color={PALETTE.primary} style={{ marginTop: 20 }}/>
            ) : (
                <TouchableOpacity style={[styles.button, {marginTop: 10}]} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
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

// Updated styles using the PALETTE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: PALETTE.background,
  },
  logoContainer: { // Container for both images
    width: 180, // Adjust to be slightly larger than your main logo if splash is bigger
    height: 180, // Adjust as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Margin for the whole logo group
    // backgroundColor: 'rgba(0,0,0,0.1)', // For debugging layout
  },
  splashIcon: { // Background splash icon
    width: '100%', // Or a fixed size, e.g., 180
    height: '100%', // Or a fixed size, e.g., 180
    position: 'absolute', // Position behind the main logo
    // opacity: 0.7, // Optional: make it slightly transparent
  },
  logo: { // Foreground logo
    width: 150,
    height: 150,
    // No marginBottom here, handled by logoContainer
    // zIndex: 1, // Ensure logo is on top (usually default behavior if rendered after)
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PALETTE.darkPrimary,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: PALETTE.white,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: PALETTE.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: PALETTE.inputText,
    width: '100%',
  },
  button: {
    height: 50,
    backgroundColor: PALETTE.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: PALETTE.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    color: PALETTE.darkPrimary,
    textAlign: 'center',
    padding: 5,
  },
  errorText: {
    color: PALETTE.errorRed,
    textAlign: 'center',
    marginBottom: 10,
    width: '100%',
  },
});

export default LoginScreen;
