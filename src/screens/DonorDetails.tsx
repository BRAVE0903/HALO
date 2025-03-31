import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconNames = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const DonorDetails = ({ navigation }: { navigation: any }) => {
  const [selectedType, setSelectedType] = useState('restaurant');
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: '',
    city: '',
  });

  const donorTypes: Array<{
    id: string;
    icon: IconNames;
    label: string;
  }> = [
    {
      id: 'restaurant',
      icon: 'food',
      label: 'Restaurant',
    },
    {
      id: 'bakery',
      icon: 'food-croissant',
      label: 'Bakery',
    },
    {
      id: 'individual',
      icon: 'account',
      label: 'Individual',
    },
    {
      id: 'business',
      icon: 'briefcase',
      label: 'Business',
    },
  ];

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
  };

  const handlePinLocation = () => {
    // Handle location pinning
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donor Details</Text>

      <View style={styles.typeContainer}>
        {donorTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.selectedType,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <MaterialCommunityIcons
              name={type.icon}
              size={24}
              color={selectedType === type.id ? '#0096FF' : '#666'}
            />
            <Text
              style={[
                styles.typeLabel,
                selectedType === type.id && styles.selectedTypeLabel,
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={formData.businessName}
          onChangeText={(text) =>
            setFormData({ ...formData, businessName: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Name (Optional)"
          value={formData.contactName}
          onChangeText={(text) =>
            setFormData({ ...formData, contactName: text })
          }
        />
        <View style={styles.phoneInput}>
          <TextInput
            style={styles.countryCode}
            value="+91"
            editable={false}
          />
          <TextInput
            style={styles.phoneNumber}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={formData.mobileNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, mobileNumber: text })
            }
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email Id"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Pin Code"
          keyboardType="number-pad"
          value={formData.pinCode}
          onChangeText={(text) => setFormData({ ...formData, pinCode: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
        />

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={handlePinLocation}
        >
          <Text style={styles.locationButtonText}>Pin Location by map</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    width: '23%',
  },
  selectedType: {
    backgroundColor: '#E6F4FF',
  },
  typeLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  selectedTypeLabel: {
    color: '#0096FF',
  },
  form: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  phoneInput: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  countryCode: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 12,
    width: '20%',
    marginRight: 8,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#F5F5F5',
  },
  phoneNumber: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  locationButton: {
    padding: 12,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#0096FF',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#0096FF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonorDetails;