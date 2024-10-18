import { Camera, CameraType } from 'expo-camera/legacy';
import { useState, useEffect, useRef } from 'react';
import AWS from 'aws-sdk';
import * as base64js from 'base64-js'; // Import base64-js for base64 to Uint8Array conversion


// AWS SDK v2 Configuration
AWS.config.update({
    region: "ap-south-1", // Replace with your AWS region
    accessKeyId: "AKIAQ4J5X6G4XRIQAOHV", // Replace with your AWS Access Key
    secretAccessKey: "DU4/My+GKQO5kcBEhY+b4bSv0xRiu/ygtPWiVGuh",
  });

const rekognition = new AWS.Rekognition(); // Rekognition client from AWS SDK v2

// Hook to manage camera permissions, toggle camera type, and manage camera ref
export const useCamera = () => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  return { type, permission, requestPermission, toggleCameraType, cameraRef };
};

// Function to mark attendance by capturing the photo and sending it to Rekognition
export const markAttendance = async (cameraRef, setIsProcessing) => {
  if (cameraRef.current) {
    setIsProcessing(true);

    try {
      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      // Convert base64 string to Uint8Array (byte array) using base64-js
      const imageBytes = base64js.toByteArray(photo.base64);

      // Prepare the image to send to Rekognition (using Uint8Array)
      const params = {
        CollectionId: 'employees', // Your Rekognition Face Collection ID
        Image: {
          Bytes: imageBytes,  // Send the converted byte array (Uint8Array)
        },
        MaxFaces: 1, // Limit the result to 1 face (best match)
        FaceMatchThreshold: 90, // Confidence threshold
      };

      // Send the image to AWS Rekognition
      const rekognitionResponse = await rekognition.searchFacesByImage(params).promise();
      console.log(rekognitionResponse);

      // Check if any faces match
      if (rekognitionResponse.FaceMatches && rekognitionResponse.FaceMatches.length > 0) {
        const matchedFace = rekognitionResponse.FaceMatches[0];
        const matchingImageName = matchedFace.Face.ExternalImageId; // Get the image name (ExternalImageId)
        console.log({matchingImageName});    
        return { success: true, message: `Attendance marked for ${matchingImageName}`,matchingImageName };
           
      } else {
        return { success: false, message: 'No matching face found in the collection.' };
      }
    } catch (error) {
      console.error("Error comparing faces:", error);
      return { success: false, message: 'There was an issue processing the attendance.' };
    } finally {
      setIsProcessing(false);
    }
  }
};

// Function to navigate to Camera screen
export const goToConfirmation = (navigation) => {
    navigation.navigate('Confirmation'); // Navigate to the Confirmation screen
  };
  
