// src/screens/Homepage.tsx
console.log('Homepage.tsx (Original with Debugging): Module Loaded by Bundler.'); // MODULE LEVEL LOG

import React, { useState, useEffect, useLayoutEffect } from 'react'; // Added useEffect, useLayoutEffect
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import AppBar from '../components/AppBar_States/Appbar';
import { RouteProp, useRoute } from '@react-navigation/native'; // useNavigation removed as 'navigation' prop is used
import { StackNavigationProp } from '@react-navigation/stack';
import { SceneMap, TabBar, TabView, SceneRendererProps as TabViewSceneRendererProps } from 'react-native-tab-view'; // Renamed SceneRendererProps to avoid conflict
import { SafeAreaView } from 'react-native-safe-area-context';
// import { MaterialIcons } from '@expo/vector-icons'; // Not used

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

// Define type for our specific routes used in TabView
type MyRoute = { key: string; title: string };

// Placeholder components for the tabs
const DonorRoute = (props: TabViewSceneRendererProps & { route: MyRoute }) => {
    console.log('Homepage.tsx: DonorRoute rendering');
    return (
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
};

const ReceiverRoute = (props: TabViewSceneRendererProps & { route: MyRoute }) => {
    console.log('Homepage.tsx: ReceiverRoute rendering');
    return (
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
};


const renderScene = SceneMap({
    donor: DonorRoute,
    receiver: ReceiverRoute,
});

const Homepage = ({ route, navigation }: Props) => {
    console.log('Homepage.tsx (Original with Debugging): Component function executing. Params:', JSON.stringify(route.params, null, 2)); // COMPONENT FUNCTION LOG

    useLayoutEffect(() => {
        console.log('Homepage.tsx: useLayoutEffect for header');
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        console.log('Homepage.tsx (Original with Debugging): useEffect[] (MOUNTED). Params:', JSON.stringify(route.params, null, 2)); // MOUNT LOG
        return () => {
            console.log('Homepage.tsx (Original with Debugging): useEffect[] (UNMOUNTING)'); // UNMOUNT LOG
        };
    }, [route.params]); // Added route.params to re-log if they change, but primarily for mount.

    const userName = route.params?.name ?? ''; // Use nullish coalescing for safety
    const userRole = route.params?.role ?? '';

    const [index, setIndex] = useState(0);
    const [routes] = useState<MyRoute[]>([ // Explicitly type the routes array
        { key: 'donor', title: 'DONOR' },
        { key: 'receiver', title: 'RECEIVER' },
    ]);

    // Updated renderLabel to better align with TabBar's expected props
    const renderLabel = ({ route: tabRoute, focused, color }: { route: MyRoute; focused: boolean; color: string }) => (
        <Text style={{
            fontWeight: 'bold',
            color: focused ? PALETTE.primary : color, // Use focused for primary, else use color from TabBar
        }}>
            {tabRoute.title}
        </Text>
    );

    const renderTabBar = (
        props: TabViewSceneRendererProps & { navigationState: { index: number; routes: MyRoute[] } }
    ) => {
        // console.log('Homepage.tsx: renderTabBar props:', props); // Optional: log props for TabBar
        return (
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: PALETTE.primary }}
                style={{ backgroundColor: PALETTE.white }}
                renderLabel={renderLabel} // No more @ts-expect-error needed hopefully
                // activeColor and inactiveColor are less relevant if renderLabel handles colors directly
                pressOpacity={1}
                pressColor="transparent" // Consider "rgba(0,0,0,0.05)" or similar for subtle feedback
            />
        );
    };

    const currentRoute = useRoute();

    const handlePressHome = () => {
        console.log('Homepage.tsx: handlePressHome');
        navigation.navigate('Homepage', { name: userName, role: userRole });
    };

    const handlePressMessage = () => {
        console.log('Navigate to Message Screen');
    };

    const handlePressLocation = () => {
        console.log('Navigate to Location Screen');
        // Potentially: navigation.navigate('MapScreen', { returnRoute: 'Homepage', initialCoords: route.params?.selectedCoords });
    };

    const handlePressProfile = () => {
        console.log('Homepage.tsx: handlePressProfile');
        navigation.navigate({
            name: 'ProfileScreen',
            params: { homepageParams: { name: userName, role: userRole } }
        });
    };

    console.log('Homepage.tsx (Original with Debugging): Rendering JSX...');
    return (
        <SafeAreaView style={styles.container}>
            <AppBar />
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.myPostSection}>
                    <Text style={styles.sectionTitle}>My Post</Text>
                    <View style={styles.createPostCard}>
                        <View style={styles.postInputPlaceholder}>
                            <Text style={styles.postInputText}>Do you have some food to donate?</Text>
                        </View>
                        <TouchableOpacity style={styles.createPostButton} onPress={() => navigation.navigate('DonorDetails')}>
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
    contentContainer: { flexGrow: 1, paddingBottom: 70 }, // Ensure enough padding for NavigationBar
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: PALETTE.textPrimary, marginBottom: 10, marginTop: 10 },
    myPostSection: { marginBottom: 20 },
    createPostCard: { backgroundColor: PALETTE.cardBackground, borderRadius: 8, padding: 15, ...Platform.select({ ios: { shadowColor: PALETTE.shadowColor, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }) },
    postInputPlaceholder: { backgroundColor: '#F5F5F5', borderRadius: 5, padding: 10, marginBottom: 15 },
    postInputText: { fontSize: 16, color: PALETTE.textSecondary },
    createPostButton: { backgroundColor: PALETTE.primary, paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
    createPostButtonText: { color: PALETTE.white, fontSize: 16, fontWeight: 'bold' },
    tabsSection: { flex: 1, minHeight: 300, marginBottom: 20 }, // Added minHeight to ensure TabView has space
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
    // bottomNavBar styles were removed as NavigationBar component likely has its own styling
});

export default Homepage;