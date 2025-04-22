import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppBar from '../components/AppBar_States/Appbar'; // AppBar Test

const Homepage = () => {
  return (
    <View style={styles.container}>
      <AppBar /> {/* AppBar component here  */}      
      <Text style={{ padding: 20 }}>You are a Donor...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default Homepage;
