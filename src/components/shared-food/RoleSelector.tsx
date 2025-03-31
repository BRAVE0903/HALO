import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import styles from '../../styles/SharedFood.style';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
  onContinue: () => void;
}

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

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
  onContinue
}) => {
  return (
    <>
      <View style={styles.rolesContainer}>
        <Text style={styles.sectionTitle}>Choose your role</Text>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && styles.selectedRole
            ]}
            onPress={() => onRoleSelect(role.id)}
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
        onPress={onContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </>
  );
};