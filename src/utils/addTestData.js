// src/utils/addTestData.js - UPDATED WITH AUTH CHECK
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

export const addTestItems = async (currentUser) => {
  // ✅ Check if user is authenticated
  if (!currentUser) {
    alert("Please sign in first to add test data!");
    return;
  }

  const testItems = [
    {
      ownerId: currentUser.uid, // ✅ Use actual user ID
      ownerName: currentUser.displayName || "Test User",
      type: "donation", 
      title: "Free Programming Books",
      description: "Collection of programming books I no longer need. Perfect for CS students!",
      category: "books",
      condition: "good",
      price: null,
      negotiable: false,
      imageURL: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Programming+Books",
      tags: ["programming", "books", "free"],
      status: "available",
      views: 0,
      likes: 0,
      contactMethod: "in-app"
    },
    {
      ownerId: currentUser.uid, // ✅ Use actual user ID
      ownerName: currentUser.displayName || "Test User",
      type: "sale",
      title: "Laptop Stand - Adjustable",
      description: "Barely used laptop stand, perfect for working from home. Very sturdy and adjustable height.",
      category: "accessories",
      condition: "excellent", 
      price: 25,
      negotiable: true,
      imageURL: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Laptop+Stand",
      tags: ["laptop", "stand", "desk", "work"],
      status: "available",
      views: 0,
      likes: 0,
      contactMethod: "in-app"
    }
  ];

  try {
    for (const item of testItems) {
      await addDoc(collection(db, "items"), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    alert("✅ Test items added successfully!");
  } catch (error) {
    console.error("❌ Error adding test items:", error);
    alert("Error adding test items. Check console for details.");
  }
};
