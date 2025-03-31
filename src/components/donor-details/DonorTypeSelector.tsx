import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../../styles/DonorDetails.style';

interface DonorTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const DonorTypeSelector: React.FC<DonorTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
  const donorTypes = [
    { id: 'individual', label: 'Individual' },
    { id: 'organization', label: 'Organization' },
  ];

  return (
    <View style={styles.typeContainer}>
      {donorTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={[
            styles.typeButton,
            selectedType === type.id && styles.selectedType,
          ]}
          onPress={() => onTypeSelect(type.id)}
        >
          <Text style={[
            styles.typeLabel,
            selectedType === type.id && styles.selectedTypeLabel,
          ]}>
            {type.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DonorTypeSelector;