import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import UploadMediaFile from './screens/home_screen'

export default function App() {
  // Example function for button press
  const handleButtonPress = () => {
    console.log('Button pressed!'); // You can replace this with your desired functionality
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <UploadMediaFile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
});
