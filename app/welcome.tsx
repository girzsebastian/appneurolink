import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
    <View style={styles.container}>
      <LinearGradient colors={['#06b6d4', '#0891b2']} style={styles.gradientBackground} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo-neuros-gradient-on-white.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
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
            <Text style={styles.signUpCardTitle}>Sign Up</Text>
            <Text style={styles.signUpCardSubtitle}>Start your training</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.quickDemoButton}
          onPress={handleQuickDemo}
        >
          <Text style={styles.quickDemoText}>🚀 Quick Demo (Skip Login)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.1,
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
  logo: {
    width: 350,
    height: 350,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0891b2',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
  },
  cardContainer: {
    flexDirection: 'row',
    gap: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    width: 280,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  signUpCard: {
    backgroundColor: '#06b6d4',
    borderColor: '#0891b2',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0891b2',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  signUpCardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  signUpCardSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quickDemoButton: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0891b2',
  },
  quickDemoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});

