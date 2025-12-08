import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Switch,
  Dimensions,
} from 'react-native';
import { BrainWaveData, MentalState } from '../types';
import { BrainWaveDisplay } from './BrainWaveDisplay';
import { CircularProgress } from './CircularProgress';

interface BottomBarProps {
  brainWaveData: BrainWaveData;
  mentalState: MentalState;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BAR_HEIGHT = SCREEN_HEIGHT * 0.6;

export const BottomBar: React.FC<BottomBarProps> = ({ brainWaveData, mentalState }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRawEEG, setShowRawEEG] = useState(false);
  const [showBrainWaves, setShowBrainWaves] = useState(true);
  const [translateY] = useState(new Animated.Value(BAR_HEIGHT - 60));

  const toggleBar = () => {
    const toValue = isExpanded ? BAR_HEIGHT - 60 : 0;
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity style={styles.handle} onPress={toggleBar}>
        <View style={styles.handleBar} />
        <Text style={styles.handleText}>{isExpanded ? 'Hide' : 'Show'} Data</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.switchRow}>
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Raw EEG</Text>
            <Switch
              value={showRawEEG}
              onValueChange={setShowRawEEG}
              trackColor={{ false: '#3a3a4e', true: '#4CAF50' }}
              thumbColor={showRawEEG ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Brain Waves</Text>
            <Switch
              value={showBrainWaves}
              onValueChange={setShowBrainWaves}
              trackColor={{ false: '#3a3a4e', true: '#4CAF50' }}
              thumbColor={showBrainWaves ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.circularContainer}>
          <CircularProgress
            value={mentalState.attention}
            label="Attention"
            color="#FF6B6B"
            size={140}
          />
          <CircularProgress
            value={mentalState.relaxation}
            label="Relaxation"
            color="#4ECDC4"
            size={140}
          />
        </View>

        {showBrainWaves && (
          <View style={styles.brainWavesContainer}>
            <Text style={styles.sectionTitle}>Brain Waves</Text>
            <BrainWaveDisplay data={brainWaveData} />
          </View>
        )}

        {showRawEEG && (
          <View style={styles.rawEEGContainer}>
            <Text style={styles.sectionTitle}>Raw EEG Data</Text>
            <Text style={styles.rawText}>
              EEG data visualization would go here...
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    backgroundColor: '#16161e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 12,
    cursor: 'pointer',
  },
  handleBar: {
    width: 60,
    height: 5,
    backgroundColor: '#3a3a4e',
    borderRadius: 3,
    marginBottom: 8,
  },
  handleText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  circularContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  brainWavesContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rawEEGContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
  },
  rawText: {
    color: '#888',
    fontSize: 14,
  },
});

