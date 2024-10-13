import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

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

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export firebase instance for use in other files
export { firebase };
