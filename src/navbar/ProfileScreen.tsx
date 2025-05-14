// src/navbar/ProfileScreen.tsx
// Code for the Profile Screen based on the provided image.
// Corrected import path for NavigationBar.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
// Corrected import path based on ProfileScreen being in src/navbar/
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native'; // Import useRoute
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView

// Import icons library - assuming MaterialIcons
// You might need to install this library: npm install @expo/vector-icons or expo install @expo/vector-icons
import { MaterialIcons } from '@expo/vector-icons';

// Corrected import path for AuthStackParamList based on ProfileScreen being in src/navbar/
import { AuthStackParamList } from '../navigation/AuthNavigator';
// Import the NavigationBar component - corrected path based on error message
import NavigationBar from '../components/AppBar_States/NavigationBar';


// Define the color palette (consistent with other screens)
const PALETTE = {
    background: '#FBF6E9', // Using the background color from Homepage
    lightAccent: '#E3F0AF',
    primary: '#5DB996',
    darkPrimary: '#118B50',
    white: '#FFFFFF',
    textPrimary: '#333333',
    textSecondary: '#666666',
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    shadowColor: '#000',
    profileHeaderBackground: '#E3F0AF', // Light green from the image
    profileEditIcon: '#333333', // Dark color for the edit icon
    bottomNavBackground: '#FFFFFF', // Color for the bottom nav bar
    bottomNavItemColor: '#B0B0B0', // Color for inactive nav items
    bottomNavItemActiveColor: '#5DB996', // Color for active nav item (Primary color)
    listItemBorder: '#EEEEEE', // Light border for list items
    warningIcon: '#FF0000', // Red color for warning icon
};

// Define specific prop types for ProfileScreen
type ProfileScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileScreen'>;
type ProfileScreenRouteProp = RouteProp<AuthStackParamList, 'ProfileScreen'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

const ProfileScreen = ({ navigation, route }: Props) => {

    // Hide the default stack navigator header for this screen
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    // Get the current route name using useRoute hook
    const currentRoute = useRoute();

    // Define navigation callbacks to pass to NavigationBar
    const handlePressHome = () => {
        // Navigate to Homepage - Note: Homepage requires name and role params
        // You'll need to decide how to get these params in ProfileScreen if navigating back to Homepage
        // For now, navigating without params might cause issues on Homepage if it expects them.
        // A more robust solution might involve a shared state or context for user info.
        console.log('Navigate to Homepage - Note: Homepage expects name and role params');
        // navigation.navigate('Homepage', { name: 'DefaultUser', role: 'DefaultRole' }); // Example with default params
         navigation.navigate('Homepage', route.params?.homepageParams || { name: 'Guest', role: 'Guest' }); // Example assuming Homepage params might be passed to Profile
    };

    const handlePressMessage = () => {
        // Placeholder for Message screen navigation
        console.log('Navigate to Message Screen');
        // navigation.navigate('MessageScreen'); // Uncomment and replace with your Message screen name
    };

    const handlePressLocation = () => {
        // Placeholder for Location screen navigation
        console.log('Navigate to Location Screen');
        // navigation.navigate('MapScreen'); // Uncomment and replace with your Location screen name
    };

    const handlePressProfile = () => {
        // Already on ProfileScreen, do nothing or scroll to top
        console.log('Already on Profile Screen');
        // Optional: Scroll to top of the ScrollView
        // scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };


  return (
    <SafeAreaView style={styles.container}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
            {/* Placeholder for user image/icon */}
            <View style={styles.profileImagePlaceholder}>
                 <MaterialIcons name="flash-on" size={30} color={PALETTE.primary} /> {/* Example icon */}
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Itunuoluwa Abidoye</Text> {/* Placeholder Name */}
                <Text style={styles.profileHandle}>@itunuoluwa</Text> {/* Placeholder Handle */}
            </View>
            <TouchableOpacity style={styles.editIcon}>
                <MaterialIcons name="edit" size={20} color={PALETTE.primary} />
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
            {/* My Account Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Account</Text>
                {/* My Account Item */}
                <TouchableOpacity style={styles.listItem}>
                    <MaterialIcons name="person-outline" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
                    <View style={styles.listItemTextContainer}>
                        <Text style={styles.listItemTitle}>My Account</Text>
                        <Text style={styles.listItemDescription}>Make changes to your account</Text>
                    </View>
                    {/* Assuming warning icon is conditional based on account status */}
                    {/* <MaterialIcons name="warning" size={20} color={PALETTE.warningIcon} style={styles.listItemAccessory} /> */}
                    <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
                </TouchableOpacity>
                {/* Saved Beneficiary Item */}
                <TouchableOpacity style={styles.listItem}>
                    <MaterialIcons name="bookmark-border" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
                    <View style={styles.listItemTextContainer}>
                        <Text style={styles.listItemTitle}>Saved Beneficiary</Text>
                        <Text style={styles.listItemDescription}>Manage your saved account</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
                </TouchableOpacity>
                {/* Settings Item */}
                <TouchableOpacity style={styles.listItem}>
                    <MaterialIcons name="settings" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
                    <View style={styles.listItemTextContainer}>
                        <Text style={styles.listItemTitle}>Settings</Text>
                        <Text style={styles.listItemDescription}>Adjust App preferences</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
                </TouchableOpacity>
                 {/* Log out Item */}
                <TouchableOpacity style={styles.listItem}>
                    <MaterialIcons name="logout" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
                    <View style={styles.listItemTextContainer}>
                        <Text style={styles.listItemTitle}>Log out</Text>
                        <Text style={styles.listItemDescription}>Further secure your account for safety</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* More Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>More</Text>
                {/* Manage Request Item */}
                <TouchableOpacity style={styles.listItem}>
                    <MaterialIcons name="notifications-none" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
                    <View style={styles.listItemTextContainer}>
                        <Text style={styles.listItemTitle}>Manage Request</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
                </TouchableOpacity>
                {/* Manage Donations Item */}
                <TouchableOpacity style={styles.listItem}>
                    <MaterialIcons name="favorite-border" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
                    <View style={styles.listItemTextContainer}>
                        <Text style={styles.listItemTitle}>Manage Donations</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
                </TouchableOpacity>
            </View>

        </ScrollView>

        {/* Use the NavigationBar component and pass the current route name and callbacks */}
        <NavigationBar
            activeScreen={currentRoute.name}
            onPressHome={handlePressHome}
            onPressMessage={handlePressMessage} // Pass placeholder callback
            onPressLocation={handlePressLocation} // Pass placeholder callback
            onPressProfile={handlePressProfile}
        />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.background,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.lightAccent, // Using lightAccent for header background
        padding: 15,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: PALETTE.shadowColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    profileImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25, // Make it a circle
        backgroundColor: PALETTE.primary, // Example background color
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profileInfo: {
        flex: 1, // Take up available space
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PALETTE.textPrimary,
    },
    profileHandle: {
        fontSize: 14,
        color: PALETTE.textSecondary,
    },
    editIcon: {
        padding: 5, // Add padding to make the touch target larger
    },
    content: {
        flex: 1,
        paddingHorizontal: 15, // Add horizontal padding
        paddingBottom: 70, // Add padding at the bottom for the navbar
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PALETTE.textPrimary,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PALETTE.cardBackground,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: PALETTE.shadowColor,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
        borderWidth: 1,
        borderColor: PALETTE.listItemBorder,
    },
    listItemIcon: {
        marginRight: 15,
    },
    listItemTextContainer: {
        flex: 1, // Allow text to take up available space
        marginRight: 10, // Space between text and accessory/arrow
    },
    listItemTitle: {
        fontSize: 16,
        color: PALETTE.textPrimary,
        marginBottom: 2,
    },
    listItemDescription: {
        fontSize: 12,
        color: PALETTE.textSecondary,
    },
    listItemAccessory: {
        marginRight: 5, // Space between warning icon and arrow - commented out as warning icon is conditional
    },
    // Removed bottomNavBar styles as they are now in the NavigationBar component
    // Removed bottomNavItem styles as they are now in the NavigationBar component
    // Removed bottomNavItemText styles as they are now in the NavigationBar component
});

export default ProfileScreen;
