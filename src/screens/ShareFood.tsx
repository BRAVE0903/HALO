import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

const ShareFood = ({ navigation }: { navigation: any }) => {
  const [selectedRole, setSelectedRole] = useState<string>('donor');

  const roles = [
    {
      id: 'donor',
      title: 'Donor',
      description: 'Donate some food to the needful'
    },
    {
      id: 'receiver',
      title: 'Receiver',
      description: 'Pickup and deliver food to the needful'
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'Pickup and deliver food to the needful'
    }
  ];

  const handleContinue = () => {
    if (selectedRole === 'donor') {
      navigation.navigate('DonorDetails');
    }
    // Add navigation for other roles as needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Want to share food?</Text>
      <Text style={styles.subtitle}>Be the provider and sender</Text>

      <View style={styles.rolesContainer}>
        <Text style={styles.sectionTitle}>Choose your role</Text>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && styles.selectedRole
            ]}
            onPress={() => setSelectedRole(role.id)}
          >
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={selectedRole === role.id ? 'checked' : 'unchecked'}
                color="#0096FF"
              />
              <View>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  rolesContainer: {
    marginTop: 20,
  },
  roleCard: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedRole: {
    borderColor: '#0096FF',
    backgroundColor: '#F0F9FF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
  },
  continueButton: {
    backgroundColor: '#0096FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShareFood;