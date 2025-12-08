import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen() {
  const router = useRouter();
  const [updateMessage, setUpdateMessage] = useState('Loading...');

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Check for app updates
      if (!__DEV__) {
        setUpdateMessage('Checking for updates...');
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          setUpdateMessage('Downloading update...');
          await Updates.fetchUpdateAsync();
          setUpdateMessage('Update downloaded! Restarting...');
          await Updates.reloadAsync();
        }
      }

      // Check if user is logged in
      setUpdateMessage('Loading app...');
      const userToken = await AsyncStorage.getItem('userToken');
      
      setTimeout(() => {
        if (userToken) {
          router.replace('/neurofeedback');
        } else {
          router.replace('/welcome');
        }
      }, 1500);
    } catch (error) {
      console.error('Error checking updates:', error);
      // Continue to app even if update check fails
      const userToken = await AsyncStorage.getItem('userToken');
      router.replace(userToken ? '/neurofeedback' : '/welcome');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>BrainLink</Text>
        </View>
        <Text style={styles.subtitle}>Neurofeedback Training</Text>
      </View>
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      <Text style={styles.message}>{updateMessage}</Text>
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    color: '#888',
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: '#666',
    fontSize: 14,
  },
});

