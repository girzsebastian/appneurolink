import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrainWaveData } from '../types';

interface BrainWaveDisplayProps {
  data: BrainWaveData;
}

export const BrainWaveDisplay: React.FC<BrainWaveDisplayProps> = ({ data }) => {
  const waveTypes = [
    { name: 'Delta', value: data.delta, color: '#E91E63' },
    { name: 'Theta', value: data.theta, color: '#9C27B0' },
    { name: 'Lo Alpha', value: data.loAlpha, color: '#3F51B5' },
    { name: 'Hi Alpha', value: data.hiAlpha, color: '#2196F3' },
    { name: 'Lo Beta', value: data.loBeta, color: '#00BCD4' },
    { name: 'Hi Beta', value: data.hiBeta, color: '#009688' },
    { name: 'Lo Gamma', value: data.loGamma, color: '#4CAF50' },
    { name: 'Hi Gamma', value: data.hiGamma, color: '#8BC34A' },
  ];

  return (
    <View style={styles.container}>
      {waveTypes.map((wave) => (
        <View key={wave.name} style={styles.waveItem}>
          <View style={styles.labelContainer}>
            <View style={[styles.colorIndicator, { backgroundColor: wave.color }]} />
            <Text style={styles.label}>{wave.name}</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: `${Math.max(5, wave.value)}%`, // Minimum 5% for visibility
                  backgroundColor: wave.color,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
  },
  waveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    height: 20,
    backgroundColor: '#2a2a3e',
    borderRadius: 10,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
    transition: 'width 0.3s ease-out', // Smooth animation
  },
});

