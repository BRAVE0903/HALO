// src/navbar/ProfileScreen.tsx
// Updated: Logout now primarily relies on onAuthStateChanged for navigation to LoginScreen.

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth functions

import { AuthStackParamList } from '../navigation/AuthNavigator';
import NavigationBar from '../components/AppBar_States/NavigationBar';

// PALETTE definition remains the same as your previous version
const PALETTE = {
    background: '#FBF6E9', lightAccent: '#E3F0AF', primary: '#5DB996',
    darkPrimary: '#118B50', white: '#FFFFFF', textPrimary: '#333333',
    textSecondary: '#666666', cardBackground: '#FFFFFF', cardBorder: '#E0E0E0',
    shadowColor: '#000', profileHeaderBackground: '#E3F0AF',
    profileEditIcon: '#333333', bottomNavBackground: '#FFFFFF',
    bottomNavItemColor: '#B0B0B0', bottomNavItemActiveColor: '#5DB996',
    listItemBorder: '#EEEEEE', warningIcon: '#FF0000',
};


type ProfileScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ProfileScreen'>;
type ProfileScreenRouteProp = RouteProp<AuthStackParamList, 'ProfileScreen'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

const ProfileScreen = ({ navigation, route }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const auth = getAuth();

  useEffect(() => {
    // Set initial user state
    const initialUser = auth.currentUser;
    setCurrentUser(initialUser);
    if (!initialUser && navigation.isFocused()) { // If no user on mount and screen is active
        console.log("ProfileScreen: No initial user, navigating to Login from mount effect.");
        navigation.replace('Login');
    }

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("ProfileScreen: onAuthStateChanged triggered. User:", user ? user.uid : 'null');
      setCurrentUser(user); // Update state for UI
      if (!user) {
        // If user becomes null (logged out), navigate to Login.
        // navigation.isFocused() check can be important if this screen might be in the background
        // but for a direct logout action, immediate navigation is usually desired.
        console.log("ProfileScreen: onAuthStateChanged - User is now null. Navigating to Login.");
        navigation.replace('Login');
      }
    });

    navigation.setOptions({
      headerShown: false,
    });

    return () => {
      console.log("ProfileScreen: Unsubscribing from onAuthStateChanged.");
      unsubscribe(); // Cleanup the listener when the component unmounts
    };
  }, [navigation, auth]); // Dependencies for useEffect

  const currentRoute = useRoute();

  // Navigation handlers for bottom bar (handlePressHome, etc.) remain the same
  const handlePressHome = () => {
    const userNameForHomepage = currentUser?.displayName || route.params?.homepageParams?.name || 'Guest';
    const userRoleForHomepage = route.params?.homepageParams?.role || (currentUser ? 'user' : 'Guest');
    navigation.navigate('Homepage', { name: userNameForHomepage, role: userRoleForHomepage });
  };
  const handlePressMessage = () => { /* ... */ };
  const handlePressLocation = () => { /* ... */ };
  const handlePressProfile = () => { scrollViewRef.current?.scrollTo({ y: 0, animated: true }); };


  const handleLogout = async () => {
    console.log("ProfileScreen: Logout button pressed. Calling auth.signOut().");
    try {
      await auth.signOut();
      // Navigation to LoginScreen will now be handled by the onAuthStateChanged listener.
      console.log('ProfileScreen: auth.signOut() completed. Listener should handle navigation.');
    } catch (error: any) {
      console.error("ProfileScreen: Error during auth.signOut(): ", error);
      Alert.alert("Logout Error", `Could not log out: ${error.message || 'Please try again.'}`);
    }
  };

  // JSX remains largely the same, ensure currentUser checks are in place for display
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImagePlaceholder}>
          <MaterialIcons name={currentUser?.photoURL ? "person" : "account-circle"} size={30} color={PALETTE.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileEmailAsMain}>{currentUser?.email || 'No email provided'}</Text>
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={() => console.log("Edit profile pressed")}>
          <MaterialIcons name="edit" size={20} color={PALETTE.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.content} contentContainerStyle={{ paddingBottom: 70 }}>
        {/* ... Your existing list items ... */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <TouchableOpacity style={styles.listItem} onPress={() => console.log("My Account pressed")}>
            <MaterialIcons name="person-outline" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
            <View style={styles.listItemTextContainer}>
              <Text style={styles.listItemTitle}>My Account</Text>
              <Text style={styles.listItemDescription}>Make changes to your account</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => console.log("Saved Beneficiary pressed")}>
            <MaterialIcons name="bookmark-border" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
            <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemTitle}>Saved Beneficiary</Text>
                <Text style={styles.listItemDescription}>Manage your saved account</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={() => console.log("Settings pressed")}>
            <MaterialIcons name="settings" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
            <View style={styles.listItemTextContainer}>
                <Text style={styles.listItemTitle}>Settings</Text>
                <Text style={styles.listItemDescription}>Adjust App preferences</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
            <View style={styles.listItemTextContainer}>
              <Text style={styles.listItemTitle}>Log out</Text>
              <Text style={styles.listItemDescription}>Further secure your account for safety</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
           <TouchableOpacity style={styles.listItem} onPress={() => console.log("Manage Request pressed")}>
             <MaterialIcons name="notifications-none" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
             <View style={styles.listItemTextContainer}>
               <Text style={styles.listItemTitle}>Manage Request</Text>
             </View>
             <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
           </TouchableOpacity>
           <TouchableOpacity style={styles.listItem} onPress={() => console.log("Manage Donations pressed")}>
             <MaterialIcons name="favorite-border" size={24} color={PALETTE.textSecondary} style={styles.listItemIcon} />
             <View style={styles.listItemTextContainer}>
               <Text style={styles.listItemTitle}>Manage Donations</Text>
             </View>
             <MaterialIcons name="chevron-right" size={24} color={PALETTE.textSecondary} />
           </TouchableOpacity>
        </View>
      </ScrollView>

      <NavigationBar
        activeScreen={currentRoute.name as keyof AuthStackParamList}
        onPressHome={handlePressHome}
        onPressMessage={handlePressMessage}
        onPressLocation={handlePressLocation}
        onPressProfile={handlePressProfile}
      />
    </SafeAreaView>
  );
};

// Styles remain the same as your last provided version
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.background },
  profileHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.lightAccent, paddingHorizontal: 15, paddingVertical: 20, marginBottom: 20, ...Platform.select({ ios: { shadowColor: PALETTE.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }) },
  profileImagePlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: PALETTE.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  profileInfo: { flex: 1, justifyContent: 'center' },
  profileEmailAsMain: { fontSize: 18, fontWeight: 'bold', color: PALETTE.textPrimary },
  editIcon: { padding: 8 },
  content: { flex: 1, paddingHorizontal: 15 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: PALETTE.textPrimary, marginBottom: 12 },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.cardBackground, borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, marginBottom: 10, ...Platform.select({ ios: { shadowColor: PALETTE.shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2.5 }, android: { elevation: 2 } }), borderWidth: 1, borderColor: PALETTE.listItemBorder },
  listItemIcon: { marginRight: 15 },
  listItemTextContainer: { flex: 1, marginRight: 10 },
  listItemTitle: { fontSize: 16, color: PALETTE.textPrimary, marginBottom: 3 },
  listItemDescription: { fontSize: 13, color: PALETTE.textSecondary },
});

export default ProfileScreen;