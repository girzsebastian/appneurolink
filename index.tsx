// Import the Expo Router App component
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { AppRegistry } from 'react-native';

// Render and register the root component
// This is the same approach used by expo-router/entry-classic
renderRootComponent(App);

// Explicitly register as "main" for Android MainActivity
// This ensures the bare workflow can find the component by name
AppRegistry.registerComponent('main', () => App);

