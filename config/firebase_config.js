import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCy_NyLZYj58MM0BQNkp-kteblQvMH6WTw",
  authDomain: "facerec-fb8e1.firebaseapp.com",
  projectId: "facerec-fb8e1",
  storageBucket: "facerec-fb8e1.appspot.com",
  messagingSenderId: "794085062282",
  appId: "1:794085062282:web:d6c39ba9c30a8f08d3df73",
  measurementId: "G-QGHB62TW5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Export the Firestore and Storage instances
export { firestore, storage };






