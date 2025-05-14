// src/screens/MapScreen.tsx
// Updated: Marker component uncommented to show the intended pin.
// WARNING: This code WILL LIKELY CRASH in Expo Go due to native component errors.
// It requires a Development Build (created via EAS Build) to function correctly.

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
// Marker and Callout imports are used now
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';

// Define the hardcoded coordinates
const HARDCODED_LOCATION = {
    latitude: 14.729869,
    longitude: 121.139717,
    title: "Halo Location", // Title for the marker callout
    description: "This is the designated spot." // Description for the marker callout
};

const MapScreen = ({ navigation, route }: any) => {
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
    // markerCoords holds the hardcoded location, used by the Marker and button
    const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(HARDCODED_LOCATION);
    const [mapRegion, setMapRegion] = useState<Region | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMessage, setLoadingMessage] = useState('Requesting permissions...');
    const mapRef = useRef<MapView>(null);

    const returnRoute = route.params?.returnRoute;

    // 1. Request Permissions & Set Initial Map Region to Hardcoded Location
    useEffect(() => {
        (async () => {
            setLoading(true);
            setLoadingMessage('Requesting location permissions...');
            let { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission denied. Map will center on the fixed location.');
            }
            setLoadingMessage('Preparing map...');

            setMarkerCoords(HARDCODED_LOCATION); // Ensure markerCoords is set
            setMapRegion({
                latitude: HARDCODED_LOCATION.latitude,
                longitude: HARDCODED_LOCATION.longitude,
                latitudeDelta: 0.005, // Adjust zoom level for the hardcoded pin
                longitudeDelta: 0.005,
            });
            setLoading(false);
        })();
    }, [navigation]);

    // Animate map to region when map is ready AND mapRegion is set
    useEffect(() => {
         if (isMapReady && mapRegion && mapRef.current) {
             mapRef.current.animateToRegion(mapRegion, 500);
         }
     }, [isMapReady, mapRegion]);


    // Handle Setting Location (will now always use the hardcoded coordinates)
    const handleSetLocation = () => {
        if (!markerCoords) {
            Alert.alert('Error', 'Location not set.');
            return;
        }
        if (!returnRoute) {
             Alert.alert('Error', 'Could not determine where to return location.');
             return;
        }
        console.log(`Setting hardcoded location to ${returnRoute}:`, markerCoords);

        // Optional: Animate to location before navigating
        if (mapRef.current && mapRegion) {
            mapRef.current.animateToRegion({
                latitude: markerCoords.latitude,
                longitude: markerCoords.longitude,
                latitudeDelta: mapRegion.latitudeDelta,
                longitudeDelta: mapRegion.longitudeDelta,
            }, 500);
        }

        setTimeout(() => {
            // Return only latitude and longitude
            navigation.navigate(returnRoute, {
                selectedCoords: {
                    latitude: markerCoords.latitude,
                    longitude: markerCoords.longitude
                }
            });
        }, 600);
    };

    // --- Render Logic ---
    if (loading) {
        return <View style={styles.centerScreen}><ActivityIndicator size="large" color="#0096FF" /><Text style={styles.loadingText}>{loadingMessage}</Text></View>;
    }
    if (!mapRegion) {
       return <View style={styles.centerScreen}><ActivityIndicator size="large" color="#0096FF" /><Text style={styles.loadingText}>Preparing map data...</Text></View>;
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={mapRegion} // Map will center on the hardcoded location
                showsUserLocation={locationPermission ?? false}
                showsMyLocationButton={locationPermission ?? false}
                onMapReady={() => { console.log("Map is Ready"); setIsMapReady(true); }}
            >
                {/* --- Marker component is now UNCOMMENTED --- */}
                {/* This will display the pin at the hardcoded location IF running in a compatible environment (Dev Build) */}
                {markerCoords && (
                    <Marker
                        coordinate={markerCoords} // Uses HARDCODED_LOCATION
                        title={HARDCODED_LOCATION.title}
                        description={HARDCODED_LOCATION.description}
                        pinColor="red" // Or your preferred color
                        // Not draggable
                    >
                        {/* Optional: Custom Callout for more detailed info window */}
                        {/* <Callout tooltip>
                            <View style={styles.calloutView}>
                                <Text style={styles.calloutTitle}>{HARDCODED_LOCATION.title}</Text>
                                <Text>{HARDCODED_LOCATION.description}</Text>
                            </View>
                        </Callout> */}
                    </Marker>
                )}
                {/* --- End Marker --- */}
            </MapView>

            {/* Removed CenterPinMarker component */}

            <TouchableOpacity style={styles.setLocationButton} onPress={handleSetLocation} disabled={!markerCoords}>
                <Text style={styles.setLocationButtonText}>Confirm This Location</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    centerScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
    },
    // Removed centerPinContainer and centerPinImage styles
    setLocationButton: {
        position: 'absolute',
        bottom: 40,
        left: 30,
        right: 30,
        height: 55,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    setLocationButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Optional styles for custom callout
    // calloutView: { ... },
    // calloutTitle: { ... }
});

export default MapScreen;

