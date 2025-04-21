// src/screens/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Ensure this path is correct if your navigator isn't in src/navigation
import { AuthStackParamList } from '../navigation/AuthNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<
    AuthStackParamList,
    'Register'
>;

// --- MAKE SURE THIS LINE IS EXACTLY 'export const RegisterScreen =' ---
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
            await setDoc(userDocRef, { uid: user.uid, email: user.email, createdAt: new Date(), role: null });
            console.log("User document created for:", user.uid);
            navigation.navigate('RoleSelection');
        } catch (error: any) {
            console.error("Registration failed:", JSON.stringify(error));
            let errorMessage = 'An unknown error occurred during registration.';
            if (error.code === 'auth/email-already-in-use') errorMessage = 'This email address is already registered.';
            else if (error.code === 'auth/weak-password') errorMessage = 'Password is too weak.';
            else if (error.message) errorMessage = error.message;
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email"/>
            <TextInput style={styles.input} placeholder="Password (min. 6 characters)" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password"/>
            {isLoading ? (<ActivityIndicator size="large" color="#007AFF" style={styles.loader} />) : (<Button title="Register" onPress={handleRegister} />)}
             <View style={{ marginTop: 15 }}><Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} color="grey" /></View>
        </View>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({ /* ... styles from previous example ... */
    container: { flex: 1, padding: 25, justifyContent: 'center', backgroundColor: '#F5F5F5' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
    input: { height: 50, borderColor: '#DDD', borderWidth: 1, marginBottom: 15, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#FFF', fontSize: 16 },
    loader: { marginVertical: 20 }
});

// --- MAKE SURE there is NO 'export default' line below this ---