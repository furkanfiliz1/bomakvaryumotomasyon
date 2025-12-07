import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC8MCfS7FXcm4f7DzyP6EtGi7j1ztbxqU",
  authDomain: "bomakvaryum-d98d2.firebaseapp.com",
  databaseURL: "https://bomakvaryum-d98d2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bomakvaryum-d98d2",
  storageBucket: "bomakvaryum-d98d2.firebasestorage.app",
  messagingSenderId: "1007339268927",
  appId: "1:1007339268927:web:8beafef94a748314ebc18a",
  measurementId: "G-F7D6YF9Y42"
};

console.log('🔥 Firebase Config loaded:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(firebaseApp);

console.log('✅ Firebase Firestore initialized');

// Export firebase app for use in other modules
export default firebaseApp;
