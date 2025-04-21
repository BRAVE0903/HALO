// App.tsx (UPDATED import path relying on tsconfig alias)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthNavigator from './src/navigation/AuthNavigator';

// --- Updated Firebase JS SDK imports ---
import { initializeApp, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// --- CORRECTED Auth Imports (using tsconfig path alias) ---
import { initializeAuth, getReactNativePersistence } from '@firebase/auth'; // <-- CHANGE THIS BACK
// --- End Correction ---
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './src/firebaseConfig';
// --- End Firebase imports ---


// --- Initialization Calls (run ONCE when app loads) ---
const app = initializeApp(firebaseConfig);

// Initialize Auth WITH Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
console.log("Firebase Auth initialized with AsyncStorage persistence.");

// Initialize Analytics only if supported
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized.");
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
});
// --- End Initialization Calls ---


export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AuthNavigator />
    </NavigationContainer>
  );
}