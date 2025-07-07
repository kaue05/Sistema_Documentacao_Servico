import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import '@expo/metro-runtime'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/views/homeScreen'
import CameraScreen from './src/views/cameraScreen'
import FotoScreen from './src/views/fotoScreen';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen}
        options={{
          title: "Registrador de Serviços",
          headerStyle: { backgroundColor: "#8E1616" },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen name="Camera" component={CameraScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="Foto" component={FotoScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
      <StatusBar style='auto' />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0
  },
});
