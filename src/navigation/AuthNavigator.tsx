// src/navigation/AuthNavigator.tsx
// Updated: Added Homepage and its params

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

/* --- Imports --- */
import LoginScreen from '../screens/LoginScreen';
import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { RegisterScreen } from '../screens/RegisterScreen'; // Assumes named export
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import DonorDetailsScreen from '../screens/DonorDetails'; // Assuming correct filename
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';
import MapScreen from '../screens/MapScreen';
// --- ADDED Homepage import ---
import Homepage from '../screens/Homepage';
// --- End Homepage import ---


// Define Param List type
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    RoleSelection: undefined;
    DonorDetails: undefined; // Or params: { selectedCoords?: ... } if needed directly
    ReceiverDetails: { selectedCoords?: { latitude: number; longitude: number } | null } | undefined;
    MapScreen: {
        returnRoute: keyof AuthStackParamList;
        initialCoords?: { latitude: number; longitude: number } | null;
    };
    // --- ADDED Homepage params ---
    Homepage: { // Define params expected by Homepage
        name: string;
        role: string;
    };
    // --- End Homepage params ---
};

const Stack = createStackNavigator<AuthStackParamList>();

// Export the navigator component
const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }}/>
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ title: 'Choose Your Role' }} />
            <Stack.Screen name="DonorDetails" component={DonorDetailsScreen} options={{ title: 'Donor Details' }} />
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
            {/* --- ADDED Homepage Screen --- */}
            <Stack.Screen
                name="Homepage"
                component={Homepage}
                // Optional: Customize header, maybe hide back button if resetting
                options={{ title: 'Home', headerLeft: () => null }}
            />
             {/* --- End Homepage Screen --- */}
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