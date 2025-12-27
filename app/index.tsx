import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait for router to be ready before navigating
    const timer = setTimeout(() => {
      // Redirect to welcome page
      router.replace('/welcome');

      // Check for updates and login status in the background
      initializeApp();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const initializeApp = async () => {
    try {
      // Check for app updates (only in production)
      if (!__DEV__) {
        try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
            return;
          }
        } catch (error) {
          console.error('Update check failed:', error);
        }
      }

      // Check if user is logged in and redirect to dashboard if needed
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        // Small delay to ensure welcome page is shown first, then redirect
      setTimeout(() => {
          router.replace('/neurofeedback');
        }, 500);
        }
    } catch (error) {
      console.error('Error initializing app:', error);
}
  };

  return null;
}

