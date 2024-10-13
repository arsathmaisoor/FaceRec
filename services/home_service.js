import { firestore } from '../config/firebase'; // Import the initialized Firestore instance
import firebase from 'firebase/compat/app';

// Function to test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Add a test document
    const testDocRef = firestore.collection('testCollection').doc('testDoc');
    await testDocRef.set({
      message: 'Firebase is connected!',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // Retrieve the test document
    const doc = await testDocRef.get();
    if (doc.exists) {
      console.log('Document data:', doc.data());
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
};
