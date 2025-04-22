import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNavBar from '../components/AppBar_States/NavBar';
import Homepage from '../screens/Homepage';

const Tab = createBottomTabNavigator();

const DummyScreen = () => null;

const MainTabs = () => {
  return (
    <Tab.Navigator tabBar={(props) => <BottomNavBar {...props} />}>
      <Tab.Screen name="Home" component={Homepage} options={{ headerShown: false }}/>
      <Tab.Screen name="Message" component={DummyScreen} />
      <Tab.Screen name="Search" component={DummyScreen} />
      <Tab.Screen name="Profile" component={DummyScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;