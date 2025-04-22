// src/screens/MapScreen.tsx
// Updated version with fix for loading indicator timing

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'; // Import PROVIDER_GOOGLE and Region type
import * as Location from 'expo-location';

// Define navigation prop types if using TypeScript
// type MapScreenProps = NativeStackScreenProps<AuthStackParamList, 'MapScreen'>; // Use your actual param list

const MapScreen = ({ navigation, route }: any) => { // Use proper typing if available
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
    const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [mapRegion, setMapRegion] = useState<Region | null>(null); // Use Region type
    const [isMapReady, setIsMapReady] = useState(false); // Track if map is ready
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMessage, setLoadingMessage] = useState('Requesting permissions...');
    const mapRef = useRef<MapView>(null);

    const returnRoute = route.params?.returnRoute; // Get the screen name to return to
    const initialCoords = route.params?.initialCoords; // Get initial coords if passed

    // 1. Request Permissions & Get Initial Location
    useEffect(() => {
        (async () => {
            setLoading(true); // Start loading
            setLoadingMessage('Requesting location permissions...');
            console.log("Requesting location permission...");
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log("Location permission status:", status);

            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied. Please enable it in settings to use the map feature.');
                setLocationPermission(false);
                setLoading(false); // Stop loading if permission denied
                if(navigation.canGoBack()) navigation.goBack();
                return;
            }
            setLocationPermission(true);
            setLoadingMessage('Fetching location...'); // Update loading message

            try {
                let coordsToUse: { latitude: number; longitude: number };

                if (initialCoords) {
                    console.log("Using initial coordinates:", initialCoords);
                    coordsToUse = { latitude: initialCoords.latitude, longitude: initialCoords.longitude };
                } else {
                    console.log("Fetching current position...");
                    // Consider adding a timeout or using getLastKnownPositionAsync as a fallback
                    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                    console.log("Fetched current position:", location.coords);
                    coordsToUse = { latitude: location.coords.latitude, longitude: location.coords.longitude };
                }

                setMarkerCoords(coordsToUse);
                setMapRegion({
                    latitude: coordsToUse.latitude,
                    longitude: coordsToUse.longitude,
                    latitudeDelta: 0.01, // Adjust zoom level as needed
                    longitudeDelta: 0.01,
                });

                // --- FIX: Set loading false HERE after getting coords and setting region ---
                setLoading(false);
                // --- End Fix ---

            } catch (error: any) {
                console.error("Error getting location:", error);
                 if (error.code === 'E_LOCATION_SETTINGS_UNSATISFIED') {
                    Alert.alert('Location Services Disabled', 'Please enable location services on your device.');
                 } else {
                    Alert.alert('Error', 'Could not fetch location.');
                 }
                setLoading(false); // Stop loading on error
                if(navigation.canGoBack()) navigation.goBack();
            }
        })();
    }, [initialCoords, navigation]); // Depend on initialCoords and navigation

    // useEffect to handle animation AFTER map is ready and region is set
    useEffect(() => {
         if (isMapReady && mapRegion && mapRef.current) {
             console.log("Animating map to region:", mapRegion);
             mapRef.current.animateToRegion(mapRegion, 500); // 500ms animation
             // setLoading(false); // --- FIX: Removed setLoading(false) from here ---
         }
     }, [isMapReady, mapRegion]); // Depends on map readiness and region state


    // 2. Handle Marker Dragging
    const handleMarkerDragEnd = (e: any) => {
        const newCoords = e.nativeEvent.coordinate;
        setMarkerCoords(newCoords);
        console.log('Marker dropped at:', newCoords);
    };

    // 3. Handle Setting Location
    const handleSetLocation = () => {
        if (!markerCoords) {
            Alert.alert('Error', 'No location selected.');
            return;
        }
        if (!returnRoute) {
             Alert.alert('Error', 'Could not determine where to return location.');
             console.error("MapScreen: returnRoute param missing");
             return;
        }
        console.log(`Returning coords to ${returnRoute}:`, markerCoords);
        // Navigate back to the previous screen (Donor/Receiver Details)
        // and pass the selected coordinates as a parameter
        navigation.navigate(returnRoute, { selectedCoords: markerCoords });
    };

    // --- Render Logic ---
    // Show specific loading message while fetching permissions/location
    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#0096FF" /><Text style={styles.loadingText}>{loadingMessage}</Text></View>;
    }

    // Show message if permission was denied
    if (locationPermission === false) {
         return <View style={styles.center}><Text>Location permission denied.</Text></View>;
    }

    // Show a loader briefly if region is not yet calculated (should be very short now)
    if (!mapRegion) {
       return <View style={styles.center}><ActivityIndicator size="large" color="#0096FF" /><Text style={styles.loadingText}>Preparing map...</Text></View>;
    }

    // Render the map once loading is false and region is available
    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Use Google Maps provider on Android
                initialRegion={mapRegion} // Set initial region - map will animate to this via useEffect
                showsUserLocation={true} // Show blue dot for user's current actual location
                showsMyLocationButton={true} // Simple button to jump to current location
                onMapReady={() => { console.log("Map is Ready"); setIsMapReady(true); }} // Track when map tiles are loaded
            >
        {/* Temporarily comment out the Marker to test */}
        {/* {markerCoords && (
            <Marker
                coordinate={markerCoords}
                draggable
                onDragEnd={handleMarkerDragEnd}
                title="Selected Location"
                description="Drag to adjust position"
                pinColor="red"
            />
        )} */}
    </MapView>

            {/* Set Location Button */}
            <TouchableOpacity style={styles.setLocationButton} onPress={handleSetLocation} disabled={!markerCoords}>
                <Text style={styles.setLocationButtonText}>Set This Location</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1, // Map takes up available space
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#555',
      textAlign: 'center', // Center text
    },
    setLocationButton: {
        position: 'absolute', // Position button over the map
        bottom: 40,
        left: 30,
        right: 30,
        height: 55,
        backgroundColor: '#007AFF', // iOS blue - adjust as needed
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    setLocationButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MapScreen;