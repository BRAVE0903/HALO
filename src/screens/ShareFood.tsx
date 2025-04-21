// src/screens/SharedFoodScreen.tsx (CORRECTED for Firebase JS SDK)

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert
} from 'react-native';

// --- CORRECT Firebase JS SDK imports ---
import { initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, runTransaction, serverTimestamp, Timestamp } from 'firebase/firestore'; // Added needed functions
import { firebaseConfig } from '../firebaseConfig'; // Adjust path
// --- End Firebase imports ---

import SharedFoodStyles from '../styles/SharedFood.style'; // Your styles

// Interface for Food Item data (using JS SDK Timestamp)
interface FoodItem {
  id: string; itemName: string; description?: string; pickupLocation?: string; status?: string; donorId?: string;
  claimedByUserId?: string; createdAt?: Timestamp; claimedAt?: Timestamp; // Use JS SDK Timestamp
}

// Styles for list items (keep as is)
const itemStyles = StyleSheet.create({
   itemContainer: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, borderColor: '#E8E8E8', borderWidth: 1 },
   itemName: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
   itemDescription: { fontSize: 14, color: '#555', marginBottom: 8 },
   itemLocation: { fontSize: 14, color: '#777', fontStyle: 'italic' },
   claimButton: { backgroundColor: '#28a745', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, alignSelf: 'flex-start', marginTop: 10 },
   claimButtonText: { color: '#fff', fontWeight: 'bold' },
   errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
   emptyListText: { textAlign: 'center', marginTop: 50, color: '#666' }
});

const SharedFoodScreen = ({ navigation }: any) => { // Added navigation prop
  // State hooks
  const [loading, setLoading] = useState<boolean>(true);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Initialize Firebase Services ---
  let app;
  try { app = getApp(); } catch (e) { app = initializeApp(firebaseConfig); }
  const auth = getAuth(app); // Get Auth instance
  const db = getFirestore(app); // Get Firestore instance
  // --- End Service Initialization ---

  const currentUser = auth.currentUser; // Get current user (JS SDK style)

  // Corrected useEffect using JS SDK
  useEffect(() => {
    setLoading(true); setError(null);

    // Create a query reference
    const itemsCollectionRef = collection(db, 'sharedFoodItems');
    const q = query(itemsCollectionRef, where('status', '==', 'Available'), orderBy('createdAt', 'desc'));

    // Use onSnapshot with the query
    const unsubscribe = onSnapshot(q, // Pass the query reference
      (querySnapshot) => { // Success callback
        const items: FoodItem[] = [];
        querySnapshot.forEach((docSnap) => { // Use different variable name from outer scope 'doc'
          items.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as FoodItem); // Cast data to FoodItem type
        });
        console.log("Fetched Shared Food Items:", items); // Log fetched data
        setFoodItems(items);
        setLoading(false);
      },
      (err) => { // Error callback
        console.error("Firestore Query Error:", err);
        setError("Failed to load shared food items.");
        setLoading(false);
      });

    // Return the unsubscribe function for cleanup
    return () => unsubscribe();
  }, [db]); // Dependency array includes db instance

  // Corrected claim item handler using JS SDK
  const handleClaimItem = async (itemId: string) => {
    if (!currentUser) { Alert.alert("Login Required", "Log in to claim items."); return; }

    Alert.alert("Confirm Claim", "Claim this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Claim", onPress: async () => {
          try {
            // Create a DocumentReference for the specific item
            const itemDocRef = doc(db, 'sharedFoodItems', itemId);

            // Run a transaction using JS SDK syntax
            await runTransaction(db, async (transaction) => {
              const itemDoc = await transaction.get(itemDocRef); // Use transaction.get
              if (!itemDoc.exists() || itemDoc.data()?.status !== 'Available') { // Use .exists() method
                throw new Error("Item not available.");
              }
              // Use transaction.update
              transaction.update(itemDocRef, {
                status: 'Claimed',
                claimedByUserId: currentUser.uid,
                claimedAt: serverTimestamp() // Use JS SDK serverTimestamp
              });
            });
            Alert.alert("Success", "Item claimed!");
          } catch (e: any) {
            console.error("Error claiming item:", e);
            Alert.alert("Error", e.message || "Could not claim item.");
          }
        }}
    ]);
  };

  // renderItem function (keep as is, but ensure 'item' has correct fields)
  const renderItem = ({ item }: { item: FoodItem }) => (
    <View style={itemStyles.itemContainer}>
      <Text style={itemStyles.itemName}>{item.itemName}</Text>
      {item.description && <Text style={itemStyles.itemDescription}>{item.description}</Text>}
      {item.pickupLocation && <Text style={itemStyles.itemLocation}>Pickup: {item.pickupLocation}</Text>}
      {currentUser && (
         <TouchableOpacity style={itemStyles.claimButton} onPress={() => handleClaimItem(item.id)}>
           <Text style={itemStyles.claimButtonText}>Claim Item</Text>
         </TouchableOpacity>
      )}
    </View>
  );

  if (loading) return <View style={SharedFoodStyles.container}><ActivityIndicator size="large" color="#0096FF" /></View>;
  if (error) return <View style={SharedFoodStyles.container}><Text style={itemStyles.errorText}>{error}</Text></View>;

  return (
    <View style={SharedFoodStyles.container}>
      <Text style={SharedFoodStyles.title}>Shared Food Available</Text>
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={itemStyles.emptyListText}>No items currently available.</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
       {/* Button to add new items (needs navigation prop) */}
       <TouchableOpacity style={SharedFoodStyles.continueButton} onPress={() => navigation.navigate('AddFoodItem')}>
         <Text style={SharedFoodStyles.continueButtonText}>+ Add Item</Text>
       </TouchableOpacity>
    </View>
  );
};

export default SharedFoodScreen;