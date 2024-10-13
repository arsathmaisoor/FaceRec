import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, firestore } from '../config/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { collection, addDoc } from 'firebase/firestore'; 

const UploadEmployee = () => {
  const [name, setName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    let imageUrl = '';

    // Upload image to Firebase Storage and get the image URL
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const imageRef = ref(storage, `employees/${name}`); // Create a reference in Firebase Storage
      await uploadBytes(imageRef, blob); // Upload image blob
      imageUrl = await getDownloadURL(imageRef); // Get download URL after upload
    }

    try {
      const employeeDetails = { name, employeeNumber, email, image: imageUrl };
      await addDoc(collection(firestore, 'employees'), employeeDetails); // Add document to Firestore
      Alert.alert('Success', 'Employee details uploaded successfully!');
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload employee details');
      console.error('Error adding document: ', error);
    }
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !employeeNumber || !email) {
      Alert.alert('Error', 'All fields are required!');
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email address!');
      return false;
    }
    if (/\d/.test(name)) {
      Alert.alert('Error', 'Name should not contain numbers!');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setName('');
    setEmployeeNumber('');
    setEmail('');
    setImage(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Employee</Text>
      <TextInput
        placeholder="Employee Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Employee Number"
        value={employeeNumber}
        onChangeText={setEmployeeNumber}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Employee Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Text>Image selected!</Text>}
      <Button title="Upload Employee" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default UploadEmployee;
