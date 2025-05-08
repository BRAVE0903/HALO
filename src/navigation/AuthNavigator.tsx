// src/navigation/AuthNavigator.tsx
// Updated: Corrected imports and parameter list definitions.

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

/* --- Imports --- */
import LoginScreen from '../screens/LoginScreen';
import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
// Corrected to named import if RegisterScreen.tsx uses 'export const RegisterScreen'
import { RegisterScreen } from '../screens/RegisterScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
// Assuming filenames are DonorDetailsScreen.tsx and ReceiverDetailsScreen.tsx
import DonorDetailsScreen from '../screens/DonorDetails';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';
import MapScreen from '../screens/MapScreen';
import Homepage from '../screens/Homepage';


// Define Param List type
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    RoleSelection: undefined;
    DonorDetails: { // Params for DonorDetails
        selectedCoords?: { latitude: number; longitude: number } | null;
        returnRoute?: string | null; // Or keyof AuthStackParamList
    } | undefined; // Make the entire params object optional if screen can be called without any
    ReceiverDetails: { // Params for ReceiverDetails
        selectedCoords?: { latitude: number; longitude: number } | null;
        returnRoute?: string | null; // Or keyof AuthStackParamList
    } | undefined; // Make the entire params object optional
    MapScreen: { // Params for MapScreen
        returnRoute: keyof AuthStackParamList; // Route name to return to
        initialCoords?: { latitude: number; longitude: number } | null;
    };
    Homepage: { // Params for Homepage
        name: string;
        role: string;
        // Optional params if navigating back from MapScreen to Homepage
        selectedCoords?: { latitude: number; longitude: number } | null;
        returnRoute?: string | null; // Or keyof AuthStackParamList
    };
};

const Stack = createStackNavigator<AuthStackParamList>();

// Export the navigator component
const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Create Account' }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: 'Reset Password' }}
            />
            <Stack.Screen
                name="RoleSelection"
                component={RoleSelectionScreen}
                options={{ title: 'Choose Your Role' }}
            />
            <Stack.Screen
                name="DonorDetails"
                component={DonorDetailsScreen}
                options={{ title: 'Donor Details' }}
            />
            <Stack.Screen
                name="ReceiverDetails"
                component={ReceiverDetailsScreen}
                options={{ title: 'Receiver Details' }}
            />
            <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{ title: 'Select Location' }}
            />
            <Stack.Screen
                name="Homepage"
                component={Homepage}
                options={{ title: 'Home', headerLeft: () => null }} // Hides back button on Homepage
            />
        </Stack.Navigator>
    );
};

// Default export for the navigator
export default AuthNavigator;

/*
NOTE ON NAVIGATION STRUCTURE:
Ideally, after login, you would switch to a completely different Navigator stack
(e.g., <AppStack />) that contains screens like Homepage, DonorDashboard, etc.
The top-level App.tsx would conditionally render <AuthNavigator /> or <AppStack />
based on the user's authentication state (e.g., using onAuthStateChanged).
Adding Homepage to AuthNavigator works for now but isn't the standard pattern
for separating auth flow from the main authenticated app flow.
*/
