// src/services/itemService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  serverTimestamp,
  increment,
  runTransaction 
} from "firebase/firestore";

// ✅ ADD this missing import:
import { db } from "./firebase";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY; // Using Vite env variable

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    return result.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// Create Item
export async function createItem(itemData) {
  try {
    const itemsCollection = collection(db, "items");
    const docRef = await addDoc(itemsCollection, {
      ...itemData,
      views: 0,
      likes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
}

// Get All Items with Pagination
export async function getAllItems(lastDoc = null, limitCount = 12) {
  try {
    let q = query(
      collection(db, "items"),
      where("status", "in", ["available", "pending"]),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const items = [];
    let lastVisible = null;

    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
      lastVisible = doc;
    });

    return { items, lastVisible, hasMore: items.length === limitCount };
  } catch (error) {
    console.error("Error getting items:", error);
    throw error;
  }
}

// Get Items with Filters
export async function getFilteredItems(filters = {}) {
  try {
    let constraints = [where("status", "in", ["available", "pending"])];
    
    // Add type filter
    if (filters.type && filters.type !== "all") {
      constraints.push(where("type", "==", filters.type));
    }
    
    // Add category filter
    if (filters.category && filters.category !== "all") {
      constraints.push(where("category", "==", filters.category));
    }
    
    // Add condition filter
    if (filters.condition && filters.condition !== "all") {
      constraints.push(where("condition", "==", filters.condition));
    }
    
    // Add owner filter (for user's items)
    if (filters.ownerId) {
      constraints.push(where("ownerId", "==", filters.ownerId));
    }

    const q = query(
      collection(db, "items"),
      ...constraints,
      orderBy("createdAt", "desc"),
      limit(filters.limit || 50)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error("Error getting filtered items:", error);
    throw error;
  }
}

// Get Item by ID and increment views
export async function getItemById(id, currentUser = null) {
  try {
    const docRef = doc(db, "items", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // ✅ Only increment views if user is authenticated
      if (currentUser) {
        try {
          await updateDoc(docRef, {
            views: increment(1)
          });
        } catch (viewError) {
          // Ignore view increment errors - not critical
          console.warn("Could not increment views:", viewError);
        }
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting item:", error);
    throw error;
  }
}

// Get User's Items
export async function getUserItems(userId) {
  try {
    const q = query(
      collection(db, "items"),
      where("ownerId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    }));
  } catch (error) {
    console.error("Error getting user items:", error);
    throw error;
  }
}

// Update Item
export async function updateItem(itemId, updateData) {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

// Update Item Status
export async function updateItemStatus(itemId, status) {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, {
      status: status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating item status:", error);
    throw error;
  }
}

// Delete Item - FIXED VERSION
export async function deleteItem(itemId) {
  try {
    const itemRef = doc(db, "items", itemId);
    await deleteDoc(itemRef);
    // Note: ImgBB images don't need cleanup like Firebase Storage
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}

// Search Items
export async function searchItems(searchQuery, filters = {}) {
  try {
    // For basic search, we'll get all items and filter on client side
    // For production, consider using Algolia or similar for full-text search
    const allItems = await getFilteredItems(filters);
    
    if (!searchQuery || searchQuery.trim() === "") {
      return allItems;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  } catch (error) {
    console.error("Error searching items:", error);
    throw error;
  }
}

// Like/Unlike Item
export async function toggleItemLike(itemId, userId, isLiked) {
  try {
    const itemRef = doc(db, "items", itemId);
    
    await runTransaction(db, async (transaction) => {
      const itemDoc = await transaction.get(itemRef);
      if (!itemDoc.exists()) {
        throw new Error("Item does not exist!");
      }
      
      const currentLikes = itemDoc.data().likes || 0;
      const newLikes = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
      
      transaction.update(itemRef, { likes: newLikes });
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
}
