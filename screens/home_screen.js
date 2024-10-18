import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { pickImage, uploadMedia, goToCamera } from '../services/home_services'; // Import methods from home_services.js
import { styles } from '../styles/home_styles'; // Import styles from home_styles.js

const UploadMediaFile = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [customName, setCustomName] = useState('');
  const [email, setEmail] = useState('');
  const [remarks, setRemarks] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add New Employee</Text>

      <TouchableOpacity onPress={() => pickImage(setImage)} style={styles.button}>
        <Text style={styles.buttonText}>Select Photo</Text>
      </TouchableOpacity>

      {image && (
        <>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <TextInput
            style={styles.input}
            placeholder="Enter Employee Name"
            value={customName}
            onChangeText={setCustomName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Employee Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Remarks"
            value={remarks}
            onChangeText={setRemarks}
          />
        </>
      )}

      <TouchableOpacity 
        onPress={() => uploadMedia(image, customName, email, remarks, setImage, setCustomName, setEmail, setRemarks, setUploading)} 
        style={styles.button} 
        disabled={uploading}
      >
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Employee'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Attendance Marker</Text>

      <TouchableOpacity onPress={() => goToCamera(navigation)} style={styles.button}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UploadMediaFile;
