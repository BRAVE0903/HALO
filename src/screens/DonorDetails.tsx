// src/screens/DonorDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ScrollView, StyleSheet, Image, ActivityIndicator
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
// Ensure DonorScreenFormData is imported if you use it explicitly for typing formData
import { AuthStackParamList, DonorScreenFormData } from '../navigation/AuthNavigator';

type FoodCategory = 'Restaurant' | 'Bakery' | 'Individual' | 'Business' | null;

type SimplePickerProps = {
  label: string;
  options: string[];
  selectedValue: FoodCategory;
  onValueChange: (value: FoodCategory) => void;
};

// SimplePicker component (assuming it's defined as in your provided code)
const SimplePickerImpl = ({ label, options, selectedValue, onValueChange }: SimplePickerProps) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.pickerOption,
              selectedValue === option && styles.pickerOptionSelected
            ]}
            onPress={() => onValueChange(option as FoodCategory)}
          >
            <Text style={selectedValue === option ? styles.pickerOptionTextSelected : styles.pickerOptionText}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );


type DonorDetailsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'DonorDetails'>;
type DonorDetailsScreenRouteProp = RouteProp<AuthStackParamList, 'DonorDetails'>;

type Props = {
  navigation: DonorDetailsScreenNavigationProp;
  route: DonorDetailsScreenRouteProp;
};

const DonorDetailsScreen = ({ navigation, route }: Props) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foodCategory, setFoodCategory] = useState<FoodCategory>(null);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [foodImage, setFoodImage] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  // Refactored useEffect to handle incoming params more efficiently
  useEffect(() => {
    const currentParams = route.params;
    let paramsToClear: Partial<NonNullable<AuthStackParamList['DonorDetails']>> = {};
    let stateChanged = false;

    if (currentParams?.selectedCoords) {
      if (pickupLocation?.latitude !== currentParams.selectedCoords.latitude || pickupLocation?.longitude !== currentParams.selectedCoords.longitude) {
        setPickupLocation(currentParams.selectedCoords);
        stateChanged = true;
      }
      paramsToClear.selectedCoords = undefined;
    }

    if (currentParams?.formData) {
      const { foodCategory: cat, itemName: name, description: desc, foodImage: img } = currentParams.formData;
      // Only update state if the incoming param data is different from current state
      // This helps prevent unnecessary re-renders if params are re-processed without actual change
      if (foodCategory !== cat) { setFoodCategory(cat); stateChanged = true; }
      if (itemName !== name) { setItemName(name); stateChanged = true; }
      if (description !== desc) { setDescription(desc); stateChanged = true; }
      if (foodImage !== img) { setFoodImage(img); stateChanged = true; }
      paramsToClear.formData = undefined;
    }

    if (Object.keys(paramsToClear).length > 0) {
      navigation.setParams(paramsToClear);
    }
  }, [route.params, navigation, foodCategory, itemName, description, foodImage, pickupLocation]);


  const handleImagePick = async () => {
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera roll access is needed to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].base64) {
      setFoodImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } else if (!result.canceled) {
      Alert.alert('Image Error', 'Could not get image data. Please try again.');
    }
  };

  const handleAddLocation = () => {
    // Ensure DonorScreenFormData is defined in AuthNavigator or imported
    const currentFormData: DonorScreenFormData = {
      foodCategory,
      itemName,
      description,
      foodImage,
    };
    navigation.navigate('MapScreen', {
      returnRoute: 'DonorDetails',
      formData: currentFormData
    });
  };

  const handleSaveFoodItem = async () => {
    if (!currentUser) {
      setError('User not logged in. Please restart the app or log in again.');
      // For this specific case (not logged in), we'll keep the existing behavior
      // as it's a prerequisite issue, not a "form not filled" issue.
      return;
    }

    const isFormInvalid = !foodCategory || !itemName.trim() || !foodImage || !pickupLocation;

    if (isFormInvalid) {
      const homepageParams = {
        name: currentUser.displayName || 'User', // Use display name or a default
        role: 'donor', // Role is 'donor' as this is DonorDetailsScreen
      };
      Alert.alert(
        "Incomplete Donation Details",
        "Please ensure all required fields (category, item name, image, and location) are filled. You will be redirected to the homepage.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('Homepage', homepageParams)
          }
        ]
      );
      return; // Stop further execution
    }

    // If form is valid, proceed to save
    setSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, 'foodItems'), {
        donorId: currentUser.uid,
        foodCategory,
        itemName: itemName.trim(),
        description: description.trim() || null,
        imageBase64: foodImage,
        pickupLocation,
        status: 'available',
        createdAt: Timestamp.now()
      });
      Alert.alert(
        'Success',
        'Food item donation saved successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(`Failed to save food item: ${errorMessage}`);
      Alert.alert('Save Failed', `Could not save the donation: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.centerContainer}>
        <Text>Please log in to donate. You may need to restart the app.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Donor Product Details</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <SimplePickerImpl
        label="Types Of Food Item"
        options={['Restaurant', 'Bakery', 'Individual', 'Business']}
        selectedValue={foodCategory}
        onValueChange={setFoodCategory}
      />

      <TouchableOpacity style={styles.imageUploadContainer} onPress={handleImagePick}>
        {foodImage ? (
          <Image source={{ uri: foodImage }} style={styles.uploadedImage} />
        ) : (
          <View style={styles.imageUploadPlaceholder}>
            <Text style={styles.imageUploadText}>Tap to upload food image</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter item name (e.g., Bread Loaf, Vegetable Curry)"
          value={itemName}
          onChangeText={setItemName}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Describe the food item (e.g., quantity, ingredients, best before)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.locationButtonContainer} onPress={handleAddLocation}>
        <Text style={styles.locationButtonText}>
          {pickupLocation ? "Change Location" : "Add Pickup Location"}
        </Text>
        {pickupLocation && (
          <Text style={styles.selectedLocationText}>
            Selected: {pickupLocation.latitude.toFixed(4)}, {pickupLocation.longitude.toFixed(4)}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          // Disable button visually if saving, or if form is invalid (for visual cue only, main logic is in handleSave)
          (saving || (!foodCategory || !itemName.trim() || !foodImage || !pickupLocation)) && styles.buttonDisabled
        ]}
        onPress={handleSaveFoodItem}
        disabled={saving} // Actual disable based on saving state; navigation handles invalid form.
      >
        {saving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Submit Donation</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Using SimplePickerImpl as the component for the SimplePicker type
const SimplePicker = SimplePickerImpl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6E9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF6E9',
    padding: 20,
    textAlign: 'center' as 'center',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#118B50',
  },
  fieldGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
    textTransform: 'capitalize',
  },
  input: {
    height: 50,
    borderColor: '#5DB996',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    height: 50,
    backgroundColor: '#118B50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: { // Style for when button is visually disabled based on form validity
    backgroundColor: '#A9A9A9', // Darker grey for disabled
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#5DB996',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  pickerOptionSelected: {
    backgroundColor: '#E3F0AF',
    borderColor: '#118B50',
  },
  pickerOptionText: {
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#118B50',
    fontWeight: 'bold',
  },
  imageUploadContainer: {
    width: '100%',
    height: 150,
    borderColor: '#5DB996',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  imageUploadPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#666',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationButtonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#5DB996',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 16,
    color: '#118B50',
    fontWeight: '500',
  },
  selectedLocationText: {
    fontSize: 14,
    color: '#5DB996',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default DonorDetailsScreen;