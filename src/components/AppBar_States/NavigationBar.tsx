// src/components/NavigationBar.tsx
// Reusable Bottom Navigation Bar component.
// Updated to use callback props for navigation.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// Removed useNavigation as navigation is handled by parent via props
// Removed AuthStackParamList import as it's not needed internally


// Define the color palette (consistent with other screens)
const PALETTE = {
    bottomNavBackground: '#FFFFFF', // Color for the bottom nav bar
    bottomNavItemColor: '#B0B0B0', // Color for inactive nav items
    bottomNavItemActiveColor: '#5DB996', // Color for active nav item (Primary color)
    shadowColor: '#000',
};

// Define the props for the NavigationBar component
type NavigationBarProps = {
    activeScreen: string; // The name of the currently active screen (string for flexibility)
    onPressHome: () => void;
    onPressMessage: () => void; // Placeholder for Message screen navigation
    onPressLocation: () => void; // Placeholder for Location screen navigation
    onPressProfile: () => void;
};

const NavigationBar: React.FC<NavigationBarProps> = ({
    activeScreen,
    onPressHome,
    onPressMessage,
    onPressLocation,
    onPressProfile,
}) => {

    return (
        <View style={styles.bottomNavBar} pointerEvents="auto">
            {/* Nav Item: Home */}
            <TouchableOpacity
                style={styles.bottomNavItem}
                onPress={onPressHome} // Use the callback prop
            >
                <MaterialIcons
                    name="home"
                    size={24}
                    // Determine color based on activeScreen prop
                    color={activeScreen === 'Homepage' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor}
                />
                <Text
                    style={[
                        styles.bottomNavItemText,
                        // Determine text color based on activeScreen prop
                        { color: activeScreen === 'Homepage' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor }
                    ]}
                >
                    Home
                </Text>
            </TouchableOpacity>

            {/* Nav Item: Message */}
            <TouchableOpacity
                style={styles.bottomNavItem}
                onPress={onPressMessage} // Use the callback prop
            >
                <MaterialIcons
                    name="message"
                    size={24}
                     // Determine color based on activeScreen prop (using a placeholder name 'MessageScreen')
                    color={activeScreen === 'MessageScreen' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor}
                />
                <Text
                    style={[
                        styles.bottomNavItemText,
                         // Determine text color based on activeScreen prop (using a placeholder name 'MessageScreen')
                        { color: activeScreen === 'MessageScreen' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor }
                    ]}
                >
                    Message
                </Text>
            </TouchableOpacity>

            {/* Nav Item: Location */}
            <TouchableOpacity
                style={styles.bottomNavItem}
                onPress={onPressLocation} // Use the callback prop
            >
                <MaterialIcons
                    name="location-pin"
                    size={24}
                    // Determine color based on activeScreen prop (assuming MapScreen is the location screen)
                    color={activeScreen === 'MapScreen' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor}
                />
                <Text
                    style={[
                        styles.bottomNavItemText,
                         // Determine text color based on activeScreen prop (assuming MapScreen)
                        { color: activeScreen === 'MapScreen' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor }
                    ]}
                >
                    Location
                </Text>
            </TouchableOpacity>

            {/* Nav Item: Profile */}
            <TouchableOpacity
                style={styles.bottomNavItem}
                onPress={onPressProfile} // Use the callback prop
            >
                <MaterialIcons
                    name="person"
                    size={24}
                     // Determine color based on activeScreen prop
                    color={activeScreen === 'ProfileScreen' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor}
                />
                <Text
                    style={[
                        styles.bottomNavItemText,
                         // Determine text color based on activeScreen prop
                        { color: activeScreen === 'ProfileScreen' ? PALETTE.bottomNavItemActiveColor : PALETTE.bottomNavItemColor }
                    ]}
                >
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: PALETTE.bottomNavBackground,
        height: 60, // Fixed height for the bottom nav bar
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0', // Light border at the top
        ...Platform.select({
            ios: {
                shadowColor: PALETTE.shadowColor,
                shadowOffset: { width: 0, height: -2 }, // Shadow at the top
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 8, // Elevation for shadow on Android
            },
        }),
        position: 'absolute', // Position absolutely at the bottom
        bottom: 0, // Align to the bottom edge
        left: 0, // Align to the left edge
        right: 0, // Align to the right edge
        width: '100%', // Ensure it spans the full width
    },
    bottomNavItem: {
        flex: 1, // Distribute space evenly
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5, // Add some vertical padding for touch area
    },
    bottomNavItemText: {
        fontSize: 12,
    },
});

export default NavigationBar;