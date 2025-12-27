import React from 'react';
import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { BottomBar } from './BottomBar';
import { useBrainLink } from '../hooks/useBrainLink';
import { BrainWaveData, MentalState } from '../types';

export const GlobalBottomBar: React.FC = () => {
  const pathname = usePathname();
  const {
    isConnected,
    attention,
    meditation,
    delta,
    theta,
    lowAlpha,
    highAlpha,
    lowBeta,
    highBeta,
    lowGamma,
    midGamma,
    rawEEG,
  } = useBrainLink();

  // Don't show on login/register screens
  const hideOnPaths = ['/', '/register'];
  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  // Only show when connected
  if (!isConnected) {
    return null;
  }

  // Normalize brain wave data
  const normalizeBrainWave = (value: number): number => {
    if (value === 0) return 0;
    const logValue = Math.log10(Math.max(value, 1));
    const normalized = ((logValue - 3) / 3) * 100;
    return Math.max(0, Math.min(100, normalized));
  };

  const brainWaveData: BrainWaveData = {
    delta: normalizeBrainWave(delta),
    theta: normalizeBrainWave(theta),
    loAlpha: normalizeBrainWave(lowAlpha),
    hiAlpha: normalizeBrainWave(highAlpha),
    loBeta: normalizeBrainWave(lowBeta),
    hiBeta: normalizeBrainWave(highBeta),
    loGamma: normalizeBrainWave(lowGamma),
    hiGamma: normalizeBrainWave(midGamma),
  };

  const mentalState: MentalState = {
    attention,
    relaxation: meditation,
  };

  const isReceivingData = attention > 0 || meditation > 0;

  return (
    <View style={styles.container}>
      <BottomBar
        brainWaveData={brainWaveData}
        mentalState={mentalState}
        isConnected={isConnected}
        isReceivingData={isReceivingData}
        rawEegData={rawEEG}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
});

