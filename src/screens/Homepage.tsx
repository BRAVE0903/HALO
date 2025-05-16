// src/screens/Homepage.tsx
// Updated: Corrected import path for NavigationBar based on likely file structure.

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import AppBar from '../components/AppBar_States/Appbar';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native'; // Import useRoute
import { StackNavigationProp } from '@react-navigation/stack';
import { SceneMap, TabBar, TabView, SceneRendererProps } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Import AuthStackParamList from your AuthNavigator
import { AuthStackParamList } from '../navigation/AuthNavigator';
// Import the NavigationBar component - corrected path
import NavigationBar from '../components/AppBar_States/NavigationBar';


// Define the color palette (consistent with other screens)
type PaletteType = {
    background: string;
    lightAccent: string;
    primary: string;
    darkPrimary: string;
    white: string;
    textPrimary: string;
    textSecondary: string;
    cardBackground: string;
    cardBorder: string;
    shadowColor: string;
    bottomNavBackground: string;
    bottomNavItemColor: string;
    bottomNavItemActiveColor: string;
};

const PALETTE: PaletteType = {
    background: '#FBF6E9',
    lightAccent: '#E3F0AF',
    primary: '#5DB996',
    darkPrimary: '#118B50',
    white: '#FFFFFF',
    textPrimary: '#333333',
    textSecondary: '#666666',
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E0E0',
    shadowColor: '#000',
    bottomNavBackground: '#FFFFFF',
    bottomNavItemColor: '#B0B0B0',
    bottomNavItemActiveColor: '#5DB996',
};

// Define specific prop types for Homepage using the imported AuthStackParamList
type HomepageNavigationProp = StackNavigationProp<AuthStackParamList, 'Homepage'>;
type HomepageRouteProp = RouteProp<AuthStackParamList, 'Homepage'>;

type Props = {
    navigation: HomepageNavigationProp;
    route: HomepageRouteProp;
};

const initialLayout = { width: Dimensions.get('window').width };

// Placeholder components for the tabs
// Added type annotation for props to clarify structure
const DonorRoute = ({ route }: SceneRendererProps & { route: { key: string; title: string } }) => (
    <ScrollView contentContainerStyle={styles.tabContent}>
        {/* Placeholder Donor Item Card */}
        <View style={styles.itemCard}>
            <View style={styles.itemImagePlaceholder} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>Item Name</Text>
                <Text style={styles.itemDistance}>2.5km</Text>
                <Text style={styles.itemDescription}>Short Description Text here</Text>
                <TouchableOpacity style={styles.chatButton}>
                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
         {/* Added more placeholder cards for scrolling test */}
         <View style={styles.itemCard}>
            <View style={styles.itemImagePlaceholder} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>Another Item</Text>
                <Text style={styles.itemDistance}>3.0km</Text>
                <Text style={styles.itemDescription}>More description text.</Text>
                <TouchableOpacity style={styles.chatButton}>
                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
         <View style={styles.itemCard}>
            <View style={styles.itemImagePlaceholder} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>Third Item</Text>
                <Text style={styles.itemDistance}>1.5km</Text>
                <Text style={styles.itemDescription}>Yet more description.</Text>
                <TouchableOpacity style={styles.chatButton}>
                    <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
);

// Added type annotation for props to clarify structure
const ReceiverRoute = ({ route }: SceneRendererProps & { route: { key: string; title: string } }) => (
    <ScrollView contentContainerStyle={styles.tabContent}>
        {/* Placeholder Receiver Item Card */}
        <View style={styles.itemCard}>
            <View style={styles.itemImagePlaceholder} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>Restaurants Name 1</Text>
                <Text style={styles.itemDistance}>2.5km</Text>
                <Text style={styles.itemDescription}>340 meals served till now</Text>
                <View style={styles.receiverButtons}>
                    <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
         {/* Added more placeholder cards for scrolling test */}
         <View style={styles.itemCard}>
            <View style={styles.itemImagePlaceholder} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>Restaurant Two</Text>
                <Text style={styles.itemDistance}>1.8km</Text>
                <Text style={styles.itemDescription}>Serving delicious food.</Text>
                <View style={styles.receiverButtons}>
                    <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.connectButton}>
                        <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </ScrollView>
);


const renderScene = SceneMap({
    donor: DonorRoute,
    receiver: ReceiverRoute,
});

const Homepage = ({ route, navigation }: Props) => {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    // Explicitly check if route.params is defined before accessing properties
    const userName = route.params ? route.params.name : '';
    const userRole = route.params ? route.params.role : '';

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'donor', title: 'DONOR' },
        { key: 'receiver', title: 'RECEIVER' },
    ]);

    // Removed useFocusEffect for location data as it was commented out and not used in UI


    // Defined renderLabel as a separate function
    const renderLabel = ({ route, focused }: { route: { key: string; title: string }, focused: boolean }) => (
        <Text style={{
            fontWeight: 'bold',
            color: focused ? PALETTE.primary : PALETTE.textSecondary,
        }}>
            {route.title}
        </Text>
    );

    // Explicitly define the props type for renderTabBar
    const renderTabBar = (props: SceneRendererProps & { navigationState: { index: number; routes: { key: string; title: string }[] } }) => {
        return (
            // @ts-expect-error - Temporarily ignore this type error related to renderLabel
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: PALETTE.primary }}
                style={{ backgroundColor: PALETTE.white }}
                // Passed the separate renderLabel function
                renderLabel={renderLabel}
                activeColor={PALETTE.primary}
                inactiveColor={PALETTE.textSecondary}
                pressOpacity={1}
                pressColor="transparent"
            />
        );
    };

    // Get the current route name using useRoute hook
    const currentRoute = useRoute();

    // Define navigation callbacks to pass to NavigationBar
    const handlePressHome = () => {
        navigation.navigate('Homepage', { name: userName, role: userRole });
    };

    const handlePressMessage = () => {
        navigation.navigate('MessageScreen', { name: userName, role: userRole });
    };

    const handlePressLocation = () => {
        navigation.navigate('MapScreen', { returnRoute: 'Homepage', initialCoords: undefined });
    };

    const handlePressProfile = () => {
        navigation.navigate('ProfileScreen', { homepageParams: { name: userName, role: userRole } });
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <AppBar />
                <View style={styles.myPostSection}>
                    <Text style={styles.sectionTitle}>My Post</Text>
                    <View style={styles.createPostCard}>
                        <View style={styles.postInputPlaceholder}>
                            <Text style={styles.postInputText}>Do you have some food to donate?</Text>
                        </View>
                        <TouchableOpacity style={styles.createPostButton}>
                            <Text style={styles.createPostButtonText}>+ Create a Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.tabsSection}>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                        renderTabBar={renderTabBar}
                    />
                </View>
                <View style={styles.helpFoundationSection}>
                    <Text style={styles.sectionTitle}>Help Foundation</Text>
                    <View style={styles.foundationCard}>
                        <View style={styles.foundationTextContainer}>
                            <Text style={styles.foundationText}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac diam est. Vestibulum ut semper magna. Aenean viverra aliquet lacus eget imperdiet.
                            </Text>
                        </View>
                        <View style={styles.foundationInfo}>
                            <Text style={styles.foundationNumber}>1</Text>
                            <Text style={styles.foundationTime}>5:30 pm</Text>
                        </View>
                    </View>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: PALETTE.background },
    content: { flex: 1, padding: 10 },
    contentContainer: { flexGrow: 1, paddingBottom: 70 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: PALETTE.textPrimary, marginBottom: 10, marginTop: 10 },
    myPostSection: { marginBottom: 20 },
    createPostCard: { backgroundColor: PALETTE.cardBackground, borderRadius: 8, padding: 15, ...Platform.select({ ios: { shadowColor: PALETTE.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }) },
    postInputPlaceholder: { backgroundColor: '#F5F5F5', borderRadius: 5, padding: 10, marginBottom: 15 },
    postInputText: { fontSize: 16, color: PALETTE.textSecondary },
    createPostButton: { backgroundColor: PALETTE.primary, paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
    createPostButtonText: { color: PALETTE.white, fontSize: 16, fontWeight: 'bold' },
    tabsSection: { flex: 1, marginBottom: 20 },
    tabContent: { padding: 10, backgroundColor: PALETTE.background, flexGrow: 1 },
    itemCard: { flexDirection: 'row', backgroundColor: PALETTE.cardBackground, borderRadius: 8, padding: 10, marginBottom: 10, ...Platform.select({ ios: { shadowColor: PALETTE.shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 }, android: { elevation: 2 } }), borderWidth: 1, borderColor: PALETTE.cardBorder },
    itemImagePlaceholder: { width: 80, height: 80, backgroundColor: '#E0E0E0', borderRadius: 8, marginRight: 10 },
    itemDetails: { flex: 1, justifyContent: 'center' },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: PALETTE.textPrimary, marginBottom: 2 },
    itemDistance: { fontSize: 14, color: PALETTE.textSecondary, marginBottom: 4 },
    itemDescription: { fontSize: 14, color: PALETTE.textSecondary, marginBottom: 8 },
    chatButton: { backgroundColor: PALETTE.primary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, alignSelf: 'flex-start' },
    chatButtonText: { color: PALETTE.white, fontSize: 12, fontWeight: 'bold' },
    receiverButtons: { flexDirection: 'row', marginTop: 5 },
    viewDetailsButton: { backgroundColor: PALETTE.lightAccent, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginRight: 10, alignSelf: 'flex-start' },
    viewDetailsButtonText: { color: PALETTE.textPrimary, fontSize: 12, fontWeight: 'bold' },
    connectButton: { backgroundColor: PALETTE.primary, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, alignSelf: 'flex-start' },
    connectButtonText: { color: PALETTE.white, fontSize: 12, fontWeight: 'bold' },
    helpFoundationSection: { marginBottom: 20 },
    foundationCard: { backgroundColor: PALETTE.cardBackground, borderRadius: 8, padding: 15, ...Platform.select({ ios: { shadowColor: PALETTE.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    foundationTextContainer: { flex: 1, marginRight: 10 },
    foundationText: { fontSize: 14, color: PALETTE.textSecondary },
    foundationInfo: { alignItems: 'flex-end' },
    foundationNumber: { fontSize: 24, fontWeight: 'bold', color: PALETTE.darkPrimary, marginBottom: 4 },
    foundationTime: { fontSize: 12, color: PALETTE.textSecondary },
    bottomNavBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: PALETTE.bottomNavBackground, height: 60, borderTopWidth: 1, borderTopColor: '#E0E0E0', ...Platform.select({ ios: { shadowColor: PALETTE.shadowColor, shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 8 } }), position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%' },
    bottomNavItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 5 },
    bottomNavItemText: { fontSize: 12 }
});

export default Homepage;