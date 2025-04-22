import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AuthNavigator />
    </NavigationContainer>
  );
}



// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { StatusBar } from 'expo-status-bar';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import AuthNavigator from './src/navigation/AuthNavigator';
// import MainNavigator from './src/components/AppBar_States/BottomTabs';

// const RootStack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <StatusBar style="auto" />
//       <RootStack.Navigator screenOptions={{ headerShown: false }}>
//         <RootStack.Screen name="Auth" component={AuthNavigator} />
//         <RootStack.Screen name="Main" component={MainNavigator} />
//       </RootStack.Navigator>
//     </NavigationContainer>
//   );
// }
