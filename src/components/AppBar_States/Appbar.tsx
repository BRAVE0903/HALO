import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const AppBar = () => {
  return (
    <View style={styles.container}>
      {/* Left Side: Logo and Text */}
      <View style={styles.leftSection}>
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.logo}
      />
        <View>
          <Text style={styles.appName}>HALO</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="black" />
            <Text style={styles.locationText}>4th Mound road, Quezon City</Text>
          </View>
        </View>
      </View>

      {/* Right Side: Icons */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          {/* Placeholder profile icon */}
          <View style={styles.profilePlaceholder} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C6D9C5', // soft green background
    paddingHorizontal: 16,
    paddingVertical: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomRightRadius: 16, This is to add corner radius. No need for this
    // borderBottomLeftRadius: 16, 
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#157145',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    marginLeft: 10,
  },
  profilePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF9A76',
  },
});

export default AppBar;