// src/screens/Homepage.tsx
// Updated: Corrected route param types for selectedCoords and returnRoute.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AppBar from '../components/AppBar_States/Appbar';
import { useNavigation, RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// Ensure this path is correct and AuthStackParamList is updated
import { AuthStackParamList } from '../navigation/AuthNavigator';

// Define the color palette (consistent with other screens)
const PALETTE = {
    background: '#FBF6E9',
    lightAccent: '#E3F0AF',
    primary: '#5DB996',
    darkPrimary: '#118B50',
    white: '#FFFFFF',
    textPrimary: '#333333',
    textSecondary: '#666666',
};

// Define specific prop types for Homepage using the updated AuthStackParamList
type HomepageNavigationProp = StackNavigationProp<AuthStackParamList, 'Homepage'>;
type HomepageRouteProp = RouteProp<AuthStackParamList, 'Homepage'>;

type Props = {
  navigation: HomepageNavigationProp;
  route: HomepageRouteProp;
};

const Homepage = ({ route, navigation }: Props) => {

  // These params are guaranteed by the LoginScreen navigation.reset
  const userName = route.params.name; // No '??' needed if always provided on initial nav
  const userRole = route.params.role; // No '??' needed if always provided on initial nav

  // State to hold coordinates if returned from MapScreen
  const [homeLocationCoords, setHomeLocationCoords] = useState<{latitude: number, longitude: number} | null>(null);

  // Effect to listen for coordinates returned from MapScreen
  useEffect(() => {
    // Check if selectedCoords exists on route.params (it's optional)
    if (route.params && route.params.selectedCoords && route.params.returnRoute === 'Homepage') {
        const { latitude, longitude } = route.params.selectedCoords;
        console.log('Homepage received Coords:', latitude, longitude);
        setHomeLocationCoords({ latitude, longitude });
        Alert.alert("Location Selected", `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        // Clear the params so it doesn't trigger again on focus
        // Cast to 'any' is a common workaround for setParams with optional fields
        // or ensure all possible params are defined in the target route's type in AuthStackParamList
        navigation.setParams({
            name: userName, // Keep existing required params
            role: userRole,   // Keep existing required params
            selectedCoords: undefined, // Explicitly set to undefined
            returnRoute: undefined     // Explicitly set to undefined
        } as any); // Using 'as any' for simplicity, or type more strictly
    }
  }, [route.params, navigation, userName, userRole]); // Added userName, userRole to dep array if used in setParams


  const handleOpenMap = () => {
    console.log("Navigating to MapScreen from Homepage");
    navigation.navigate('MapScreen', {
        returnRoute: 'Homepage', // Tells MapScreen where to return
        initialCoords: homeLocationCoords
    });
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
        <Text style={styles.roleText}>Your role: {userRole}</Text>
        {userRole === 'Donor' && (
          <Text style={styles.infoText}>You can start making donations.</Text>
        )}
        {userRole === 'Receiver' && (
          <Text style={styles.infoText}>You can manage received items.</Text>
        )}

        {homeLocationCoords && (
            <Text style={styles.coordsText}>
                Selected Location: Lat: {homeLocationCoords.latitude.toFixed(4)}, Lon: {homeLocationCoords.longitude.toFixed(4)}
            </Text>
        )}

        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
            <Text style={styles.mapButtonText}>Open Map / Set Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: PALETTE.darkPrimary,
  },
  roleText: {
      fontSize: 18,
      marginBottom: 20,
      color: PALETTE.textSecondary,
  },
   infoText: {
      fontSize: 16,
      color: PALETTE.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
  },
  coordsText: {
    fontSize: 14,
    color: PALETTE.darkPrimary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  mapButton: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  mapButtonText: {
    color: PALETTE.white,
    fontSize: 16,
    fontWeight: '600',
  }
});

export default Homepage;
