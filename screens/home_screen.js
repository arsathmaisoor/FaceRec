// home_screen.js

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
            placeholder="Enter file name"
            value={customName}
            onChangeText={setCustomName}
          />
        </>
      )}

      <TouchableOpacity onPress={() => uploadMedia(image, customName, setImage, setCustomName, setUploading)} style={styles.button} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Photo'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Attendance Marker</Text>

      <TouchableOpacity onPress={() => goToCamera(navigation)} style={styles.button}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UploadMediaFile;
