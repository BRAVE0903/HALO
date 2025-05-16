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
// Ensure DonorScreenFormData and LocationData are imported from your AuthNavigator
import { AuthStackParamList, DonorScreenFormData, LocationData } from '../navigation/AuthNavigator';

type FoodCategory = 'Restaurant' | 'Bakery' | 'Individual' | 'Business' | null;

type SimplePickerProps = {
 label: string;
 options: string[];
 selectedValue: FoodCategory;
 onValueChange: (value: FoodCategory) => void;
};

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
 // Use LocationData for pickupLocation to include title
 const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null);

 const auth = getAuth();
 const db = getFirestore();
 const currentUser = auth.currentUser;

 useEffect(() => {
   const currentParams = route.params;
   let paramsToClear: Partial<NonNullable<AuthStackParamList['DonorDetails']>> = {};

   if (currentParams?.selectedCoords) {
     const newCoords = currentParams.selectedCoords;
     if (
       pickupLocation?.latitude !== newCoords.latitude ||
       pickupLocation?.longitude !== newCoords.longitude ||
       pickupLocation?.title !== newCoords.title
     ) {
       setPickupLocation(newCoords);
     }
     paramsToClear.selectedCoords = undefined;
   }

   if (currentParams?.formData) {
     const { foodCategory: cat, itemName: name, description: desc, foodImage: img } = currentParams.formData;
     if (foodCategory !== cat) { setFoodCategory(cat); }
     if (itemName !== name) { setItemName(name); }
     if (description !== desc) { setDescription(desc); }
     if (foodImage !== img) { setFoodImage(img); }
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
   const currentFormData: DonorScreenFormData = {
     foodCategory,
     itemName,
     description,
     foodImage,
   };
   navigation.navigate('MapScreen', {
     returnRoute: 'DonorDetails',
     formData: currentFormData,
     initialCoords: pickupLocation // Pass current location (with title) to MapScreen
   });
 };

 const handleSaveFoodItem = async () => {
   if (!currentUser) {
     setError('User not logged in. Please restart the app or log in again.');
     return;
   }

   // Prepare homepageParams regardless of form validity for navigation
   const homepageParams = {
     name: currentUser.displayName || 'User', // Use display name or a default
     role: 'donor' as 'donor' | 'receiver', // Role is 'donor' as this is DonorDetailsScreen
   };

   const isFormInvalid = !foodCategory || !itemName.trim() || !foodImage || !pickupLocation;

   if (isFormInvalid) {
     Alert.alert(
       "Incomplete Donation Details",
       "Please ensure all required fields (category, item name, image, and location) are filled. You will be redirected to the homepage.",
       [
         {
           text: "OK",
           onPress: () => navigation.navigate('Homepage', homepageParams) // Navigate to Homepage
         }
       ]
     );
     return; // Stop further execution
   }

   // If form is valid, proceed to save data
   setSaving(true);
   setError(null);
   try {
     await addDoc(collection(db, 'foodItems'), {
       donorId: currentUser.uid,
       foodCategory,
       itemName: itemName.trim(),
       description: description.trim() || null,
       imageBase64: foodImage,
       pickupLocation: pickupLocation, // Save the whole pickupLocation object (lat, lon, title)
       status: 'available',
       createdAt: Timestamp.now()
     });
     Alert.alert(
       'Success',
       'Food item donation saved successfully!',
       [{
         text: 'OK',
         onPress: () => {
            // --- START DEBUG LOGS ---
            console.log('DonorDetailsScreen: OK pressed on success alert.');
            console.log('DonorDetailsScreen: Attempting to navigate to Homepage with params:', JSON.stringify(homepageParams));
            try {
              if (navigation.getParent) {
                console.log('DonorDetailsScreen: Parent Nav State:', JSON.stringify(navigation.getParent()?.getState(), null, 2));
              }
              console.log('DonorDetailsScreen: Current Nav State:', JSON.stringify(navigation.getState(), null, 2));
            } catch (e) {
              console.error("Error logging navigation state:", e);
            }
            // --- END DEBUG LOGS ---
           navigation.navigate('Homepage', homepageParams); // Navigate to Homepage
         }
       }]
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
         {pickupLocation ? (pickupLocation.title || "Change Location") : "Add Pickup Location"}
       </Text>
       {pickupLocation && (
         <>
           {pickupLocation.title && (
               <Text style={styles.selectedLocationTitleText}>
                 Place: {pickupLocation.title}
               </Text>
           )}
           <Text style={styles.selectedLocationText}>
             Coords: {pickupLocation.latitude.toFixed(4)}, {pickupLocation.longitude.toFixed(4)}
           </Text>
           {pickupLocation.description && (
               <Text style={styles.selectedLocationDescriptionText}>
                 Note: {pickupLocation.description}
               </Text>
           )}
         </>
       )}
     </TouchableOpacity>

     <TouchableOpacity
       style={[
         styles.button,
         (saving || (!foodCategory || !itemName.trim() || !foodImage || !pickupLocation)) && styles.buttonDisabled
       ]}
       onPress={handleSaveFoodItem}
       disabled={saving} // Only disable if currently saving; invalid form is handled by navigation.
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

const SimplePicker = SimplePickerImpl; // Alias for export or consistency if needed

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#FBF6E9' },
 centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FBF6E9', padding: 20, textAlign: 'center' as 'center' },
 contentContainer: { padding: 20, paddingBottom: 40 },
 title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#118B50' },
 fieldGroup: { marginBottom: 15 },
 label: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#333', textTransform: 'capitalize' },
 input: { height: 50, borderColor: '#5DB996', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, backgroundColor: '#fff', fontSize: 16, color: '#333' },
 descriptionInput: { height: 100, textAlignVertical: 'top', paddingTop: 15 },
 button: { height: 50, backgroundColor: '#118B50', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 20 },
 buttonDisabled: { backgroundColor: '#A9A9A9', opacity: 0.8 },
 buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
 errorText: { color: 'red', marginBottom: 15, textAlign: 'center', fontSize: 14 },
 pickerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
 pickerOption: { paddingVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: '#5DB996', borderRadius: 20, marginRight: 10, marginBottom: 10, backgroundColor: '#fff' },
 pickerOptionSelected: { backgroundColor: '#E3F0AF', borderColor: '#118B50' },
 pickerOptionText: { color: '#333' },
 pickerOptionTextSelected: { color: '#118B50', fontWeight: 'bold' },
 imageUploadContainer: { width: '100%', height: 150, borderColor: '#5DB996', borderWidth: 1, borderStyle: 'dashed', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: '#F0F0F0', overflow: 'hidden' },
 imageUploadPlaceholder: { justifyContent: 'center', alignItems: 'center' },
 imageUploadText: { fontSize: 16, color: '#666' },
 uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
 locationButtonContainer: { paddingVertical: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#5DB996', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff', alignItems: 'center' },
 locationButtonText: { fontSize: 16, color: '#118B50', fontWeight: '500' },
 selectedLocationTitleText: { fontSize: 15, color: '#118B50', fontWeight: 'bold', marginTop: 5, textAlign: 'center' },
 selectedLocationText: { fontSize: 13, color: '#5DB996', marginTop: 2, fontStyle: 'italic', textAlign: 'center' },
 selectedLocationDescriptionText: { fontSize: 12, color: '#666', marginTop: 2, fontStyle: 'italic', textAlign: 'center'},
});

export default DonorDetailsScreen;