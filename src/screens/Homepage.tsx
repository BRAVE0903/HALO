// src/screens/Homepage.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppBar from '../components/AppBar_States/Appbar';

const Homepage = ({ route }: any) => {

  const userName = route.params?.name ?? 'User';
  const userRole = route.params?.role ?? 'Unknown Role';

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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
  },
  roleText: {
      fontSize: 18,
      marginBottom: 20,
      color: '#555',
  },
   infoText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
  }
});

export default Homepage;
