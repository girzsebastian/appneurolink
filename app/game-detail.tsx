import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CircularProgress } from '../components/CircularProgress';
import { CustomButton } from '../components/CustomButton';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';
import { DEFAULT_GAME_SETTINGS } from '../games';

export default function GameDetailScreen() {
  const router = useRouter();
  const { gameId, gameTitle } = useLocalSearchParams();
  const [baseAttention, setBaseAttention] = useState(50);
  const [isDynamic, setIsDynamic] = useState(false);

  console.log('Current baseAttention:', baseAttention); // Debug log

  const handleStart = () => {
    const gameSettings = {
      baseAttention,
      isDynamic,
    };
    
    // Navigate to the game screen with settings
    const targetGameId = gameId || '1';
    router.push({
      pathname: `/games/${targetGameId}` as any,
      params: {
        gameTitle: gameTitle || 'Game',
        baseAttention: baseAttention.toString(),
        isDynamic: isDynamic.toString(),
      },
    });
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
        <Text style={styles.title}>{gameTitle || 'Attention'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.gameInfo}>
            <View style={styles.attentionDisplay}>
              <CircularProgress
                value={baseAttention}
                label="Attention"
                color="#06b6d4"
                size={200}
                strokeWidth={16}
              />
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.settingSection}>
                <Text style={styles.settingLabel}>Change Attention</Text>
                <Text style={styles.currentValue}>{baseAttention}</Text>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValue}>0</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={baseAttention}
                    onValueChange={(val) => {
                      console.log('Slider changed to:', val);
                      setBaseAttention(Math.round(val));
                    }}
                    minimumTrackTintColor="#06b6d4"
                    maximumTrackTintColor="#e2e8f0"
                    thumbTintColor="#0891b2"
                  />
                  <Text style={styles.sliderValue}>100</Text>
                </View>
              </View>

              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={isDynamic}
                  onValueChange={setIsDynamic}
                  color={isDynamic ? '#06b6d4' : undefined}
                />
                <Text style={styles.checkboxLabel}>Dynamic</Text>
                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() => {
                    Alert.alert(
                      'Dynamic Mode',
                      'Automatically adjusts base attention based on algorithmic difficulty'
                    );
                  }}
                >
                  <Text style={styles.helpButtonText}>?</Text>
                </TouchableOpacity>
              </View>
            </View>

            <CustomButton
              title="START"
              onPress={handleStart}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  placeholder: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  gameInfo: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  attentionDisplay: {
    marginBottom: 40,
  },
  settingsContainer: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 32,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingSection: {
    marginBottom: 32,
  },
  settingLabel: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    marginTop: 16,
  },
  slider: {
    flex: 1,
    height: 40,
    transform: [{ scaleY: 1.5 }],
  },
  sliderValue: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  currentValue: {
    color: '#0891b2',
    fontSize: 56,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: '600',
  },
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  helpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

