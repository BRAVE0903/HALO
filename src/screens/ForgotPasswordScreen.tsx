// src/screens/ForgotPasswordScreen.tsx (CORRECTED for Firebase JS SDK)

import React, { useState } from 'react';
import {
  View, TextInput, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet
} from 'react-native';

// --- CORRECT Firebase JS SDK imports ---
import { initializeApp, getApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // CORRECT Auth functions import
import { firebaseConfig } from '../firebaseConfig'; // Adjust path if needed
// --- End Firebase imports ---

// Styles (keep as is or adapt)
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f2f2f2' },
  input: { height: 50, width: '90%', borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#fff' },
  button: { height: 50, width: '90%', backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center' },
  successText: { color: 'green', marginBottom: 10, textAlign: 'center' },
  link: { marginTop: 15, color: '#007BFF' }
});

const ForgotPasswordScreen = ({ navigation }: any) => { // Added navigation prop
  // State hooks
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- Initialize Firebase Services ---
  let app;
  try { app = getApp(); } catch (e) { app = initializeApp(firebaseConfig); }
  const auth = getAuth(app); // Get Auth instance
  // --- End Service Initialization ---

  // Corrected password reset function
  const handlePasswordReset = async () => {
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true); setError(null); setSuccess(null);

    try {
      // --- CORRECTED Firebase JS SDK call ---
      await sendPasswordResetEmail(auth, email);
      // --- End Correction ---

      setLoading(false);
      setSuccess('Password reset email sent! Please check your inbox.');
      Alert.alert('Email Sent', 'Check email for reset instructions.');
      // setTimeout(() => navigation.goBack(), 3000); // Adapt navigation

    } catch (e: any) {
      setLoading(false);
      console.error("Password Reset FAILED - Raw Error:", e);
      console.error("Password Reset FAILED - Code:", e.code);
      console.error("Password Reset FAILED - Message:", e.message);
      let errorMessage = 'An unknown error occurred.';
      // Add specific error checks for JS SDK Auth error codes
      if (e.code === 'auth/user-not-found') errorMessage = 'No user found with this email.';
      else if (e.code === 'auth/invalid-email') errorMessage = 'Invalid email address!';
      else if (e.code === 'auth/network-request-failed') errorMessage = 'Network error.';
      else errorMessage = `Failed: ${e.message}`;
      setError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
         style={styles.input}
         placeholder="Enter your Email"
         value={email}
         onChangeText={setEmail}
         keyboardType="email-address"
         autoCapitalize="none"
       />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {success && <Text style={styles.successText}>{success}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>
      )}
      {/* Link back to Login */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
         <Text style={styles.link}>Back to Login</Text>
       </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;