import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const FirebaseTestUI = ({ onTestFirebase }) => {
  return (
    <View style={styles.container}>
      <Text>Check Firebase Connection</Text>
      <Button title="Test Firebase" onPress={onTestFirebase} />
    </View>
  );
};

// Define component-specific styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FirebaseTestUI;
