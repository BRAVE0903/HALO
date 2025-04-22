// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

/* --- Imports --- */
import LoginScreen from '../screens/LoginScreen';
import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { RegisterScreen } from '../screens/RegisterScreen'; // Assumes named export
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import DonorDetailsScreen from '../screens/DonorDetails'; // Corrected import name assumption
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';
import MapScreen from '../screens/MapScreen'; // --- Import MapScreen ---

// Define Param List type
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    RoleSelection: undefined;
    DonorDetails: undefined; // Consider adding params if needed for route.params check
    ReceiverDetails: { selectedCoords?: { latitude: number; longitude: number } | null } | undefined; // Allow receiving coords
    MapScreen: { // Define params for MapScreen
        returnRoute: keyof AuthStackParamList; // Route name to return to (e.g., 'DonorDetails')
        initialCoords?: { latitude: number; longitude: number } | null; // Optional initial coords
    };
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
            {/* Corrected DonorDetails component name assumption */}
            <Stack.Screen name="DonorDetails" component={DonorDetailsScreen} options={{ title: 'Donor Details' }} />
            <Stack.Screen
                name="ReceiverDetails"
                component={ReceiverDetailsScreen}
                options={{ title: 'Receiver Details' }}
            />
             {/* --- Added MapScreen --- */}
            <Stack.Screen
                name="MapScreen"
                component={MapScreen}
                options={{ title: 'Select Location' }}
            />
        </Stack.Navigator>
    );
};

// Default export for the navigator
export default AuthNavigator;