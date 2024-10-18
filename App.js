import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UploadMediaFile from './screens/home_screen';
import CameraScreen from './screens/camera_screen'; 
import ConfirmationScreen from './screens/confirmation_screen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={UploadMediaFile} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
