// src/services/transactionService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  runTransaction 
} from "firebase/firestore";
import { db } from "./firebase";
import { updateItemStatus } from "./itemService";

// Create Transaction
export async function createTransaction(transactionData) {
  try {
    const transactionsCollection = collection(db, "transactions");
    const docRef = await addDoc(transactionsCollection, {
      ...transactionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: transactionData.message || "Started a new request",
      lastMessageSenderId: transactionData.buyerId,
      hasUnreadMessages: true
    });

    // Update item status to pending
    if (transactionData.itemId) {
      await updateItemStatus(transactionData.itemId, "pending");
    }

    // Send initial message to messages subcollection if message exists
    if (transactionData.message && transactionData.message.trim()) {
      const messagesCollection = collection(db, "transactions", docRef.id, "messages");
      await addDoc(messagesCollection, {
        text: transactionData.message,
        senderId: transactionData.buyerId,
        senderName: transactionData.buyerName,
        type: 'text',
        createdAt: serverTimestamp()
      });
      console.log("Initial message sent to subcollection for transaction:", docRef.id);
    }

    return docRef.id;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

// Get User's Transactions (as buyer)
export async function getUserTransactions(userId) {
  try {
    const q = query(
      collection(db, "transactions"),
      where("buyerId", "==", userId),
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
    console.error("Error getting user transactions:", error);
    throw error;
  }
}

// Get Seller's Transactions (incoming requests)
export async function getSellerTransactions(userId) {
  try {
    const q = query(
      collection(db, "transactions"),
      where("sellerId", "==", userId),
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
    console.error("Error getting seller transactions:", error);
    throw error;
  }
}

// Update Transaction Status
export async function updateTransactionStatus(transactionId, status, itemId = null) {
  try {
    await runTransaction(db, async (transaction) => {
      const transactionRef = doc(db, "transactions", transactionId);
      
      transaction.update(transactionRef, {
        status: status,
        updatedAt: serverTimestamp()
      });

      // Update item status based on transaction status
      if (itemId) {
        const itemRef = doc(db, "items", itemId);
        let newItemStatus = "available";
        
        switch (status) {
          case "approved":
            newItemStatus = "pending";
            break;
          case "completed":
            newItemStatus = "sold"; // or "taken" for donations
            break;
          case "rejected":
            newItemStatus = "available";
            break;
        }
        
        transaction.update(itemRef, {
          status: newItemStatus,
          updatedAt: serverTimestamp()
        });
      }
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

// Get Transaction by ID
export async function getTransactionById(transactionId) {
  try {
    const docRef = doc(db, "transactions", transactionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting transaction:", error);
    throw error;
  }
}

// Send Message
export async function sendMessage(transactionId, messageData) {
  try {
    const messagesCollection = collection(db, "transactions", transactionId, "messages");
    await addDoc(messagesCollection, {
      ...messageData,
      createdAt: serverTimestamp()
    });

    // Update transaction last message and timestamp
    const transactionRef = doc(db, "transactions", transactionId);
    await updateDoc(transactionRef, {
      lastMessage: messageData.text,
      lastMessageSenderId: messageData.senderId,
      updatedAt: serverTimestamp(),
      hasUnreadMessages: true // You might want to handle read receipts more robustly
    });

  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Subscribe to Messages (Real-time)
import { onSnapshot } from "firebase/firestore";

export function subscribeToMessages(transactionId, callback) {
  const q = query(
    collection(db, "transactions", transactionId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));
    callback(messages);
  });
}
