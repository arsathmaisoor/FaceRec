import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { storage, firestore } from '../config/firebase_config';

// Function to pick image from gallery
export const pickImage = async (setImage) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri); // Set the selected image URI
  }
};

// Function to generate a unique employee number
const generateEmployeeNumber = () => {
  const timestamp = new Date().getTime();
  return `EMP-${timestamp}`;
};

// Function to upload the image to Firebase Storage and save details to Firestore
export const uploadMedia = async (image, customName, email, remarks, setImage, setCustomName, setEmail, setRemarks, setUploading) => {
  if (!image) {
    Alert.alert('Please select an image first!');
    return;
  }

  if (!customName || !email || !remarks) {
    Alert.alert('Please enter all the details!');
    return;
  }

  setUploading(true);

  try {
    // Get the image URI
    const { uri } = await FileSystem.getInfoAsync(image);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        reject(new TypeError('Network Request Failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    // Get file extension and create a filename
    const fileExtension = image.substring(image.lastIndexOf('.') + 1);
    const filename = `${customName}`;

    // Reference to Firebase Storage
    const storageRef = ref(storage, filename);

    // Upload the image to Firebase Storage
    await uploadBytes(storageRef, blob);
    blob.close();

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Generate a unique employee number
    const employeeNumber = generateEmployeeNumber();

    // Save employee details to Firestore under 'Employees' collection with document ID as employeeNumber
    await setDoc(doc(firestore, 'Employees', employeeNumber), {
      employeeNumber,
      name: customName,
      email,
      remarks,
      imageUrl: downloadURL,
      timestamp: serverTimestamp(),
    });

    console.log('Image URL:', downloadURL);
    
    // Success
    setUploading(false);
    Alert.alert('Photo Uploaded and Saved to Firestore Successfully!');
    setImage(null);
    setCustomName('');
    setEmail('');
    setRemarks('');
  } catch (error) {
    console.error('Upload failed', error);
    setUploading(false);
    Alert.alert('Upload failed', error.message);
  }
};

// Function to navigate to Camera screen
export const goToCamera = (navigation) => {
  navigation.navigate('Camera'); // Navigate to the Camera screen
};
