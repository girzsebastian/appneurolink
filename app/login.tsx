import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import Checkbox from 'expo-checkbox';

export default function LoginScreen() {
  const router = useRouter();
  // Pre-fill with dummy credentials for easy testing
  const [email, setEmail] = useState('demo@brainlink.com');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store user token
      await AsyncStorage.setItem('userToken', 'dummy-token-123');
      
      if (rememberMe) {
        await AsyncStorage.setItem('rememberUser', 'true');
        await AsyncStorage.setItem('userEmail', email);
      }

      router.replace('/neurofeedback');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Welcome back to your training</Text>

          <View style={styles.form}>
            <CustomInput
              label="Email"
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? '#4CAF50' : undefined}
              />
              <Text style={styles.checkboxLabel}>Remember this user?</Text>
            </View>

            <CustomButton
              title="Log In"
              onPress={handleLogin}
              loading={loading}
            />

            <View style={styles.demoInfo}>
              <Text style={styles.demoInfoText}>
                💡 Demo Credentials:{'\n'}
                Email: demo@brainlink.com{'\n'}
                Password: demo123
              </Text>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← Back to Welcome</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  checkboxLabel: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  demoInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    width: '100%',
  },
  demoInfoText: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 24,
  },
  backButtonText: {
    color: '#888',
    fontSize: 16,
  },
});

