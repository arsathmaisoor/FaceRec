import React, { useState } from 'react';
import { Button, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import useRoute to access the passed params

import { confirmAttendance } from '../services/confirmation_services';


const ConfirmationScreen = () => {
    const route = useRoute(); // Hook to get the current route and access params
    const { imageName } = route.params; // Destructure imageName from route params

  // Call confirmAttendance with the passed imageName
    const matchingImageName = confirmAttendance(imageName);

    return (
        <View>
            <Text>'Attendance marked for '{matchingImageName}</Text>
        </View>
    )
}       

export default ConfirmationScreen;