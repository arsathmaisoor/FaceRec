// camera_screen.js
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, TouchableOpacity, View, Alert, SafeAreaView, Image, TextInput } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import { confirmAttendance } from '../services/confirmation_services'; // Import confirmAttendance function

import { useCamera, markAttendance } from '../services/camera_services'; // Import camera logic and attendance service
import { styles } from '../styles/camera_styles'; // Import styles

const CameraScreen = () => {
  const navigation = useNavigation();
  const { type, permission, requestPermission, toggleCameraType, cameraRef } = useCamera();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleMarkAttendance = async () => {
    const result = await markAttendance(cameraRef, setIsProcessing);
    Alert.alert(result.success ? 'Match Found' : 'No Match Found', result.message);
    // If face was matched, navigate to Confirmation screen
    if (result.success && result.matchingImageName) {
      const confirmationMessage = confirmAttendance(result.matchingImageName); // Pass the matching image name to confirmation
      console.log(confirmationMessage); // Log or use the confirmation message
      handleGoToConfirmation(result.matchingImageName); // Navigate to confirmation screen
    }
  };

  const handleGoToConfirmation=(matchingImageName)=>{
    navigation.navigate('Confirmation',{matchingImageName});
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
          
          {/* Mark Attendance Button */}
          <TouchableOpacity
            style={styles.attendanceButton}
            onPress={handleMarkAttendance}
            disabled={isProcessing}
          >
            <Text style={styles.text}>Spot Match</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;
