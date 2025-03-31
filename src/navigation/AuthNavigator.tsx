import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import ShareFood from '../screens/ShareFood';
import DonorDetails from '../screens/DonorDetails';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ShareFood" component={ShareFood} />
      <Stack.Screen name="DonorDetails" component={DonorDetails} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;