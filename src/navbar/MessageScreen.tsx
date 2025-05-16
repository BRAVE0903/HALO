import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppBar from '../components/AppBar_States/Appbar';
import NavigationBar from '../components/AppBar_States/NavigationBar';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

const contacts = [
    { id: '1', name: 'Ayesha' },
    { id: '2', name: 'Spring Inc.' },
    { id: '3', name: 'Karen' },
    { id: '4', name: 'Mark' },
    { id: '5', name: 'Food Bank' },
];

const messages = [
    {
        id: '1',
        name: 'Help Foundation',
        text: 'Hi! We have extra food packs available for pickup today.',
        time: '9:30 pm',
        unread: 1,
    },
    {
        id: '2',
        name: 'Ayesha',
        text: 'Thank you for your donation yesterday. It helped a lot!',
        time: '9:08 pm',
        unread: 0,
    },
    {
        id: '3',
        name: 'Smile Foundation',
        text: 'Can you confirm the pickup time for tomorrow?',
        time: '8:54 pm',
        unread: 0,
    },
];

const MessageScreen = () => {
    const [search, setSearch] = useState('');
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'MessageScreen'>>();
    const route = useRoute<RouteProp<AuthStackParamList, 'MessageScreen'>>();
    const { name, role } = route.params || { name: '', role: '' };

    // NavigationBar handlers
    const handlePressHome = () => navigation.navigate('Homepage', { name, role });
    const handlePressMessage = () => {
        // Prevent navigating to MessageScreen if already focused
        // (optional: you can show a log or do nothing)
    };
    const handlePressLocation = () => navigation.navigate('MapScreen', { returnRoute: 'MessageScreen', initialCoords: undefined });
    const handlePressProfile = () => navigation.navigate('ProfileScreen', { homepageParams: { name, role } });

    return (
        <SafeAreaView style={styles.container}>
            <AppBar />
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <Text style={styles.shortcutLabel}>Shortcut Contacts</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shortcutRow}>
                    <View style={styles.shortcutItem}>
                        <View style={styles.storyCircle}>
                            <Text style={styles.plus}>+</Text>
                        </View>
                        <Text style={styles.shortcutName}>Your story</Text>
                    </View>
                    {contacts.map((c) => (
                        <View key={c.id} style={styles.shortcutItem}>
                            <View style={styles.storyCircle}>
                                <View style={styles.onlineDot} />
                            </View>
                            <Text style={styles.shortcutName}>{c.name}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.searchBarContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search NGO by name"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <Text style={styles.messagesLabel}>Messages</Text>
                <View style={styles.divider} />
                {messages.map((msg) => (
                    <TouchableOpacity
                        key={msg.id}
                        onPress={() => navigation.navigate('ChatScreen', { name: msg.name })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.messageCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.messageTitle}>{msg.name}</Text>
                                {msg.unread > 0 && (
                                    <View style={styles.unreadBadge}>
                                        <Text style={styles.unreadText}>{msg.unread}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.messageText, { paddingRight: 50 }]} numberOfLines={2}>{msg.text}</Text>
                            <Text style={styles.messageTime}>{msg.time}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <NavigationBar
                activeScreen="MessageScreen"
                onPressHome={handlePressHome}
                onPressMessage={handlePressMessage}
                onPressLocation={handlePressLocation}
                onPressProfile={handlePressProfile}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    shortcutLabel: {
        fontSize: 13,
        color: '#222',
        marginTop: 10,
        marginLeft: 16,
        marginBottom: 2,
        fontWeight: '400',
    },
    shortcutRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingLeft: 8,
    },
    shortcutItem: {
        alignItems: 'center',
        marginRight: 18,
    },
    storyCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        position: 'relative',
    },
    plus: {
        fontSize: 28,
        color: '#888',
        fontWeight: 'bold',
        marginTop: -2,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#5DB996',
        borderWidth: 2,
        borderColor: '#fff',
    },
    shortcutName: {
        fontSize: 12,
        color: '#444',
        maxWidth: 60,
        textAlign: 'center',
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 16, // Increased for more space below the search bar
    },
    searchBar: {
        backgroundColor: '#fff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#bbb',
        paddingHorizontal: 16,
        height: 40, // slightly increased for better vertical space
        fontSize: 15,
        paddingVertical: 8, // add this line to center text vertically
    },
    messagesLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111',
        marginLeft: 16,
        marginTop: 12,
        marginBottom: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 16,
        marginBottom: 0, // Remove extra margin here
    },
    messageCard: {
        backgroundColor: '#F7F7F7',
        borderRadius: 18,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
        position: 'relative',
    },
    messageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 8,
    },
    messageTime: {
        fontSize: 12,
        color: '#888',
        position: 'absolute',
        right: 16,
        bottom: 12,
    },
    unreadBadge: {
        backgroundColor: '#5DB996',
        borderRadius: 8, // smaller radius
        minWidth: 16,    // smaller width
        height: 16,      // smaller height
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        paddingHorizontal: 3,
    },
    unreadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 10, // smaller font
    },
});

export default MessageScreen;