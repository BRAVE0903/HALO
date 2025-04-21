// src/screens/LoginScreen.tsx (CORRECTED for JS SDK + Links Uncommented)

import React, { useState } from 'react';
import {
  View, TextInput, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet
} from 'react-native';

// --- CORRECT Firebase JS SDK imports ---
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig'; // Adjust path if needed
// --- End Firebase imports ---

import LoginStyles from '../styles/LoginStyles'; // Your styles import

// Define Props type if using navigation (adjust as needed)
// type LoginScreenProps = { navigation: any };

// --- MODIFIED: Added navigation prop ---
const LoginScreen = ({ navigation }: any) => {
// --- End Modification ---

  // State hooks
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Initialize Firebase Services for this screen ---
  let app;
  try {
    app = getApp(); // Get the initialized app
  } catch (e) {
    app = initializeApp(firebaseConfig); // Fallback initialization
  }
  const auth = getAuth(app); // Get Auth instance using JS SDK syntax
  // --- End Service Initialization ---


  // Firebase login function using JS SDK syntax
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    console.log("Attempting login with email:", email);
    setLoading(true);
    setError(null);

    try {
      // CORRECTED Firebase JS SDK call
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Use auth.currentUser with JS SDK
      console.log('User signed in!', auth.currentUser?.email, auth.currentUser?.uid);
      setLoading(false);
      Alert.alert('Login Successful', `Welcome ${auth.currentUser?.email}`);
      // navigation.navigate('SomeScreen'); // Adapt navigation after login

    } catch (e: any) {
      setLoading(false);
      // Log the error details
      console.error("LOGIN FAILED - Raw Error Object:", e);
      console.error("LOGIN FAILED - Error Code:", e.code);
      console.error("LOGIN FAILED - Error Message:", e.message);

      let errorMessage = 'An unknown error occurred during login.';
      // Add specific error checks for JS SDK Auth error codes
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
    <View style={LoginStyles.container}>
       {/* Optional Title Text */}
       {/* <Text style={styles.title}>Login Here</Text> */}

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

      {/* --- MODIFIED: Navigation Links Uncommented --- */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        {/* Use styles.link (defined below) or LoginStyles.link if it exists */}
        <Text style={styles.link}>Create Account</Text>
      </TouchableOpacity>
       <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        {/* Use styles.link (defined below) or LoginStyles.link if it exists */}
         <Text style={styles.link}>Forgot Password?</Text>
       </TouchableOpacity>
      {/* --- End Modification --- */}
    </View>
  );
};

// --- ADDED: Basic styles for elements not covered by LoginStyles.ts ---
// If LoginStyles.ts defines a 'link' style, you can remove 'styles.link'
// below and use 'LoginStyles.link' in the TouchableOpacity above.
const styles = StyleSheet.create({
  // title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 }, // Keep if using title
  link: { // Basic style for the navigation links
    marginTop: 15,
    color: '#007BFF', // Example color
    textAlign: 'center',
    padding: 5 // Add some padding for easier tapping
  }
});
// --- End Added Styles ---

export default LoginScreen;