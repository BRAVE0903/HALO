// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

/* --- Screen Imports --- */
import LoginScreen from '../screens/LoginScreen';
import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import DonorDetailsScreen from '../screens/DonorDetails'; // Adjusted to common naming, ensure filename matches
// import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen'; // REMOVED
import MapScreen from '../navbar/MapScreen'; // Path as per your last provided file
import Homepage from '../screens/Homepage';
import ProfileScreen from '../navbar/ProfileScreen';

/* --- Type Definitions --- */
export type DonorScreenFormData = {
  foodCategory: 'Restaurant' | 'Bakery' | 'Individual' | 'Business' | null;
  itemName: string;
  description: string;
  foodImage: string | null;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  RoleSelection: undefined;
  DonorDetails: {
    selectedCoords?: { latitude: number; longitude: number } | null;
    formData?: DonorScreenFormData | null;
  } | undefined;
  // ReceiverDetails: { // REMOVED
  //   selectedCoords?: { latitude: number; longitude: number } | null;
  //   returnRoute?: string | null;
  // } | undefined;
  MapScreen: {
    returnRoute: 'DonorDetails' | 'Homepage'; // UPDATED: Removed 'ReceiverDetails'
    initialCoords?: { latitude: number; longitude: number } | null;
    formData?: DonorScreenFormData | null;
  };
  Homepage: {
    name: string;
    role: string;
    selectedCoords?: { latitude: number; longitude: number } | null;
    returnRoute?: string | null;
  };
  ProfileScreen: { homepageParams?: { name: string; role: string } };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={
        {
          // If you were testing detachInactiveScreens, you can keep or remove it based on results
          // detachInactiveScreens: false,
        }
      }
    >
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
      {/* <Stack.Screen // REMOVED
        name="ReceiverDetails"
        component={ReceiverDetailsScreen}
        options={{ title: 'Receiver Details' }}
      /> */}
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: 'Select Location' }}
      />
      <Stack.Screen
        name="Homepage"
        component={Homepage}
        options={{ title: 'Home', headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;