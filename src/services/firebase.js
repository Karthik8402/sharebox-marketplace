// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmanj74Hc95n-VgoVJeaICmdvjwxmyjfs", 
  authDomain: "sharebox-app-3dfe2.firebaseapp.com",
  projectId: "sharebox-app-3dfe2",
  storageBucket: "sharebox-app-3dfe2.firebasestorage.app",
  messagingSenderId: "759841978146",
  appId: "1:759841978146:web:db03c97078d84c4593177b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Configure Google Auth Provider
provider.addScope('email');
provider.addScope('profile');

// Enable offline persistence (optional)
// enableNetwork(db);

export default app;
