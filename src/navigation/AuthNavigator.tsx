// src/navigation/AuthNavigator.tsx
// Updated: Added ProfileScreen to the navigator and param list.
// Cleaned: Removed extra whitespace/characters inside Stack.Navigator.
// Added: Import for the NavigationBar component.

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
import MapScreen from '../navbar/MapScreen';
import Homepage from '../screens/Homepage';
// Import the ProfileScreen - assuming it's in src/navbar/
import ProfileScreen from '../navbar/ProfileScreen';
// Import the NavigationBar component - assuming it's in src/components/
import NavigationBar from '../components/AppBar_States/NavigationBar';
// Import the MessageScreen - assuming it's in src/navbar/
import MessageScreen from '../navbar/MessageScreen';
// Import the ChatScreen - assuming it's in src/navbar/
import ChatScreen from '../navbar/ChatScreen';



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
    // Added ProfileScreen to the param list
    ProfileScreen: { homepageParams?: { name: string; role: string } };
    // Added MessageScreen to the param list
    MessageScreen: { name: string; role: string };
    // Updated ChatScreen param list
    ChatScreen: { name: string };

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
                options={{ title: 'Home', headerShown: false }} // Ensure Homepage header is hidden
            />
            {/* Added the ProfileScreen to the stack navigator */}
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ title: 'Profile', headerShown: false }} // Hide header as ProfileScreen has a custom one
            />
            {/* Added the MessageScreen to the stack navigator */}
            <Stack.Screen
                name="MessageScreen"
                component={MessageScreen}
                options={{ title: 'Messages', headerShown: false }}
            />
            {/* Added the ChatScreen to the stack navigator */}
            <Stack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{ title: 'Chat', headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Default export for the navigator
export default AuthNavigator;

