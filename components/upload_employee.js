
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { useEffect } from 'react';

useEffect(() => {
  (async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  })();
}, []);


const UploadEmployee = () => {
  const [employeeImage, setEmployeeImage] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');

  // Function to validate email
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Function to validate name
  const isValidName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  };

  // Function to upload image
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`employee_images/${Date.now()}`);
    return ref.put(blob).then(() => ref.getDownloadURL());
  };

  const handleUpload = async () => {
    if (!employeeImage) {
      Alert.alert('Please select an image');
      return;
    }

    if (employeeImage.size > 5 * 1024 * 1024) { // 5 MB limit
      Alert.alert('Image size must be less than 5 MB');
      return;
    }

    if (!isValidEmail(employeeEmail)) {
      Alert.alert('Please enter a valid email address');
      return;
    }

    if (!isValidName(employeeName)) {
      Alert.alert('Name must not contain numbers');
      return;
    }

    try {
      const imageUrl = await uploadImage(employeeImage.uri);
      const employeeData = {
        name: employeeName,
        number: employeeNumber,
        email: employeeEmail,
        imageUrl: imageUrl,
      };

      await firebase.firestore().collection('employees').add(employeeData);
      Alert.alert('Employee details uploaded successfully');
      // Reset fields
      setEmployeeImage(null);
      setEmployeeName('');
      setEmployeeNumber('');
      setEmployeeEmail('');
    } catch (error) {
      Alert.alert('Error uploading data', error.message);
    }
  };

  // Function to select an image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEmployeeImage(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {employeeImage && (
        <Image source={{ uri: employeeImage.uri }} style={styles.image} />
      )}
      <TextInput
        placeholder="Employee Name"
        value={employeeName}
        onChangeText={setEmployeeName}
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
        value={employeeEmail}
        onChangeText={setEmployeeEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button title="Upload Employee Details" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 12,
  },
});

export default UploadEmployee;
