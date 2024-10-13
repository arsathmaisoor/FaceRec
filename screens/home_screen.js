import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Alert, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../config/firebase_config'; // Import firebase from the config file
import * as FileSystem from 'expo-file-system';

const UploadMediaFile = () => {
  const [image, setImage] = useState(null); // Store the selected image
  const [uploading, setUploading] = useState(false); // Track the upload state
  const [customName, setCustomName] = useState(''); // Store the custom file name entered by the user

  // Function to pick image from gallery
  const pickImage = async () => {
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

  // Function to upload the image to Firebase Storage
  const uploadMedia = async () => {
    if (!image) {
      Alert.alert('Please select an image first!');
      return;
    }

    if (!customName) {
      Alert.alert('Please enter a name for the file!');
      return;
    }

    setUploading(true); // Set uploading state to true

    try {
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

      // Use the custom name provided by the user, or fallback to the original filename
      const fileExtension = image.substring(image.lastIndexOf('.') + 1); // Get the file extension
      const filename = `${customName}.${fileExtension}`; // Combine custom name with the original file extension

      const ref = firebase.storage().ref().child(filename); // Reference to Firebase Storage

      // Upload the file
      await ref.put(blob);
      blob.close(); // Close the blob after upload

      setUploading(false); // Set uploading state back to false
      Alert.alert('Photo Uploaded Successfully!');
      setImage(null); // Clear image after upload
      setCustomName(''); // Clear custom file name input
    } catch (error) {
      console.error(error);
      setUploading(false); // Set uploading state back to false if there's an error
      Alert.alert('Upload failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Upload Media File</Text>

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>

      {image && (
        <>
          <Image source={{ uri: image }} style={styles.imagePreview} />

          <TextInput
            style={styles.input}
            placeholder="Enter file name"
            value={customName}
            onChangeText={setCustomName} // Update the custom file name state
          />
        </>
      )}

      <TouchableOpacity onPress={uploadMedia} style={styles.button} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Image'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UploadMediaFile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: 200,
  },
});
