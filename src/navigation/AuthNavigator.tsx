// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

/* --- Imports --- */
// Verify these imports match component exports
import LoginScreen from '../screens/LoginScreen'; // Assumes export default
import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen'; // Assumes export default
import DonorDetails from '../screens/DonorDetails'; // Assumes export default
import { RegisterScreen } from '../screens/RegisterScreen'; // Assumes export const

// --- Use DEFAULT import for RoleSelectionScreen ---
import RoleSelectionScreen from '../screens/RoleSelectionScreen'; // <-- Use DEFAULT import (no {})

/* --- End Imports --- */

// Define Param List type
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  RoleSelection: undefined;
  DonorDetails: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

// Export the navigator component
const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }}/>
        {/* --- Ensure component prop uses the DEFAULT import variable --- */}
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ title: 'Choose Your Role' }} />
        <Stack.Screen name="DonorDetails" component={DonorDetails} options={{ title: 'Donor Details' }} />
    </Stack.Navigator>
  );
};

// Default export for the navigator
export default AuthNavigator;