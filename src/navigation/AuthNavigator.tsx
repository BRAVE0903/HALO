// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
// import ShareFood from '../screens/ShareFood';
// import DonorDetails from '../screens/DonorDetails';
// import Homepage from '../screens/Homepage';

// const Stack = createStackNavigator();

// const AuthNavigator = () => {
//   return (
//     <Stack.Navigator  screenOptions={{headerShown: false}}>
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Register" component={RegisterScreen} />
//       <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//       <Stack.Screen name="ShareFood" component={ShareFood} />
//       <Stack.Screen name="DonorDetails" component={DonorDetails} />
//       <Stack.Screen name="Homepage" component={Homepage}/>
//     </Stack.Navigator>
//   );
// };

// export default AuthNavigator;

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { default as ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import ShareFood from '../screens/ShareFood';
import DonorDetails from '../screens/DonorDetails';
import MainTabs from './MainTabs';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ShareFood" component={ShareFood} />
      <Stack.Screen name="DonorDetails" component={DonorDetails} />
      <Stack.Screen name="HomePage" component={MainTabs} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
