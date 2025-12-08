import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CircularProgress } from '../components/CircularProgress';
import { CustomButton } from '../components/CustomButton';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';

export default function GameDetailScreen() {
  const router = useRouter();
  const { gameId, gameTitle } = useLocalSearchParams();
  const [threshold, setThreshold] = useState(65);
  const [isDynamic, setIsDynamic] = useState(false);
  const [attentionLevel, setAttentionLevel] = useState(72);

  const handleStart = () => {
    Alert.alert(
      'Starting Game',
      `${gameTitle}\nThreshold: ${threshold}\nDynamic: ${isDynamic ? 'Yes' : 'No'}`,
      [
        {
          text: 'OK',
          onPress: () => {
            // In a real app, this would start the game
            console.log('Game started with settings:', { threshold, isDynamic });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Attention</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{gameTitle}</Text>
          
          <View style={styles.attentionDisplay}>
            <CircularProgress
              value={attentionLevel}
              label="Current Attention"
              color="#FF6B6B"
              size={200}
              strokeWidth={16}
            />
          </View>

          <View style={styles.settingsContainer}>
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Attention Threshold</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>30</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={30}
                  maximumValue={100}
                  value={threshold}
                  onValueChange={setThreshold}
                  minimumTrackTintColor="#4CAF50"
                  maximumTrackTintColor="#2a2a3e"
                  thumbTintColor="#4CAF50"
                  step={1}
                />
                <Text style={styles.sliderValue}>100</Text>
              </View>
              <Text style={styles.thresholdValue}>{Math.round(threshold)}</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={isDynamic}
                onValueChange={setIsDynamic}
                color={isDynamic ? '#4CAF50' : undefined}
              />
              <Text style={styles.checkboxLabel}>Dynamic</Text>
              <Text style={styles.checkboxDescription}>
                (Automatically adjusts difficulty)
              </Text>
            </View>
          </View>

          <CustomButton
            title="START"
            onPress={handleStart}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  gameInfo: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  attentionDisplay: {
    marginBottom: 40,
  },
  settingsContainer: {
    width: '100%',
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    padding: 32,
    marginBottom: 40,
  },
  settingSection: {
    marginBottom: 32,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
    width: 40,
  },
  thresholdValue: {
    color: '#4CAF50',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkboxDescription: {
    color: '#888',
    fontSize: 14,
    marginLeft: 4,
  },
});

