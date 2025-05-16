import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import AppBar from '../components/AppBar_States/Appbar';
import NavigationBar from '../components/AppBar_States/NavigationBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

const QUICK_OPTIONS = [
    { id: 1, text: 'Is this available?' },
    { id: 2, text: 'Can I pick up today?' },
    { id: 3, text: 'Where is the location?' },
    { id: 4, text: 'Thank you!' },
];

const getAutoReply = (msg: string) => {
    if (msg === 'Is this available?') return 'Yes, this is currently available.';
    if (msg === 'Can I pick up today?') return 'Yes, pickup is available today.';
    if (msg === 'Where is the location?') return 'The location is at the designated spot on the map.';
    if (msg === 'Thank you!') return 'You’re welcome!';
    return null;
};

const ChatScreen = () => {
    // Use correct navigation and route types
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'ChatScreen'>>();
    const route = useRoute<RouteProp<AuthStackParamList, 'ChatScreen'>>();
    const { name } = route.params || { name: 'Unknown' };


    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'them', text: `Hi! This is ${name}. How can I help you?` },
        { id: 2, sender: 'me', text: 'Hello! I saw your message about food packs.' },
        { id: 3, sender: 'them', text: 'Yes, we have some available for pickup today.' },
    ]);
    const [input, setInput] = useState('');

    // NavigationBar handlers
    const handlePressHome = () => navigation.navigate('Homepage', { name: '', role: '' });
    const handlePressMessage = () => navigation.navigate('MessageScreen', { name, role: '' });
    const handlePressLocation = () => navigation.navigate('MapScreen', { returnRoute: 'ChatScreen', initialCoords: undefined });
    const handlePressProfile = () => navigation.navigate('ProfileScreen', { homepageParams: { name: '', role: '' } });

    // Handle sending a message from the input bar
    const handleSend = () => {
        if (input.trim() === '') return;
        const nextId = chatMessages.length + 1;
        setChatMessages([...chatMessages, { id: nextId, sender: 'me', text: input }]);
        setInput('');
    };

    // Handle quick option tap
    const handleQuickOption = (optionText: string) => {
        const nextId = chatMessages.length + 1;
        const reply = getAutoReply(optionText);
        setChatMessages([
            ...chatMessages,
            { id: nextId, sender: 'me', text: optionText },
            ...(reply
                ? [{ id: nextId + 1, sender: 'them', text: reply }]
                : []),
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppBar />
            {/* Back Button and Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>{'\u25C0'}</Text>
                </TouchableOpacity>
                <Text style={styles.header}>{name}</Text>
            </View>
            <ScrollView style={styles.chatContainer}
                contentContainerStyle={{ paddingBottom: 80 }}>
                {chatMessages.map(msg => (
                    <View
                        key={msg.id}
                        style={[
                            styles.bubble,
                            msg.sender === 'me' ? styles.bubbleMe : styles.bubbleThem,
                        ]}
                    >
                        <Text style={styles.bubbleText}>{msg.text}</Text>
                    </View>
                ))}
                {/* Stylized quick prompts as chat bubbles */}
                <View style={styles.promptsRow}>
                    {QUICK_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.id}
                            style={styles.promptBubble}
                            onPress={() => handleQuickOption(opt.text)}
                        >
                            <Text style={styles.promptBubbleText}>{opt.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={input}
                        onChangeText={setInput}
                        editable={true}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.7}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <NavigationBar
                activeScreen="ChatScreen"
                onPressHome={handlePressHome}
                onPressMessage={handlePressMessage}
                onPressLocation={handlePressLocation}
                onPressProfile={handlePressProfile}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FBF6E9' },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 4,
        backgroundColor: '#FBF6E9',
    },
    backBtn: {
        padding: 8,
        marginRight: 4,
    },
    backBtnText: {
        fontSize: 22,
        color: '#5DB996',
        fontWeight: 'bold',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#222',
        marginLeft: 8,
    },
    chatContainer: {
        flex: 1,
        padding: 16,
    },
    bubble: {
        maxWidth: '75%',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
    },
    bubbleMe: {
        backgroundColor: '#5DB996',
        alignSelf: 'flex-end',
    },
    bubbleThem: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    bubbleText: {
        fontSize: 16,
        color: '#222',
    },
    promptsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 8,
        marginBottom: 16,
        gap: 8,
    },
    promptBubble: {
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    promptBubbleText: {
        fontSize: 15,
        color: '#333',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F5F5F5',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: '#5DB996',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sendButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    quickOptionsRow: {
        display: 'none', // Hide the old row, now using stylized promptsRow
    },
});

export default ChatScreen;