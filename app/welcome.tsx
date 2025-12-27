import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleQuickDemo = async () => {
    // Auto-login with dummy credentials
    await AsyncStorage.setItem('userToken', 'dummy-token-123');
    router.replace('/neurofeedback');
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>BrainLink</Text>
          </View>
          <Text style={styles.title}>Welcome to Neurofeedback</Text>
          <Text style={styles.subtitle}>Train your mind, enhance your focus</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.cardTitle}>Log In</Text>
            <Text style={styles.cardSubtitle}>Continue your journey</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.signUpCard]}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.cardTitle}>Sign Up</Text>
            <Text style={styles.cardSubtitle}>Start your training</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.quickDemoButton}
          onPress={handleQuickDemo}
        >
          <Text style={styles.quickDemoText}>🚀 Quick Demo (Skip Login)</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
  },
  cardContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  card: {
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    padding: 40,
    width: 280,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  signUpCard: {
    backgroundColor: '#4CAF50',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#ccc',
  },
  quickDemoButton: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  quickDemoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

