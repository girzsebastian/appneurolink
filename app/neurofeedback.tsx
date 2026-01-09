import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrainWaveData, MentalState } from '../types';
import { BottomBar } from '../components/BottomBar';
import { BrainLinkConnection } from '../components/BrainLinkConnection';
import { useBrainLink } from '../hooks/useBrainLink';
import { CircularProgress } from '../components/CircularProgress';

export default function NeurofeedbackScreen() {
  const router = useRouter();
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  
  const {
    isConnected,
    isScanning,
    devices,
    attention,
    meditation,
    signal,
    heartRate,
    delta,
    theta,
    lowAlpha,
    highAlpha,
    lowBeta,
    highBeta,
    lowGamma,
    midGamma,
    rawEEG,
    startScan,
    connectToDevice,
    disconnect,
    requestPermissions,
  } = useBrainLink();

  // Normalize brain wave data (values are typically 10,000 - 1,000,000)
  // Convert to 0-100 scale for better visualization
  const normalizeBrainWave = (value: number): number => {
    if (value === 0) return 0;
    // Use logarithmic scale for better distribution
    // Typical range: 10^3 to 10^6, map to 0-100
    const logValue = Math.log10(Math.max(value, 1));
    const normalized = ((logValue - 3) / 3) * 100; // 3 to 6 -> 0 to 100
    return Math.max(0, Math.min(100, normalized));
  };

  // Map to old structure for compatibility with normalized values
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
    relaxation: meditation, // Meditation = Relaxation
  };

  const rawEegData = rawEEG;
  const isReceivingData = isConnected && (attention > 0 || meditation > 0);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/');
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowConnectionModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../assets/logo-neuros-gradient-on-white.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          {isConnected && (
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedBadgeText}>● Connected</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconButton, isConnected && styles.iconButtonConnected]}
            onPress={() => setShowConnectionModal(true)}
          >
            <Text style={styles.iconButtonText}>
              {isConnected ? '✓' : '⚡'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/game-options')}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>ATTENTION</Text>
            <Text style={styles.cardSubtitle}>Focus Training Games</Text>
            <View style={styles.attentionCircleContainer}>
              <CircularProgress
                value={attention}
                label="Attention"
                color="#ffffff"
                size={120}
                strokeWidth={12}
                textColor="#ffffff"
              />
            </View>
          </View>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>🎯</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.relaxationCard]}
          onPress={() => {
            // Future: Relaxation training
          }}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>RELAXATION</Text>
            <Text style={styles.cardSubtitle}>Coming Soon</Text>
          </View>
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>🧘</Text>
          </View>
        </TouchableOpacity>
      </View>

      <BottomBar 
        brainWaveData={brainWaveData} 
        mentalState={mentalState}
        isConnected={isConnected}
        isReceivingData={isReceivingData}
        rawEegData={rawEegData}
      />
      
      <BrainLinkConnection
        visible={showConnectionModal}
        isScanning={isScanning}
        isConnected={isConnected}
        devices={devices}
        onClose={() => setShowConnectionModal(false)}
        onScan={startScan}
        onConnect={(deviceId) => {
          const device = devices.find(d => d.id === deviceId);
          if (device) connectToDevice(device);
        }}
        onDisconnect={handleDisconnect}
        onRequestPermissions={requestPermissions}
        attention={attention}
        meditation={meditation}
        signal={signal}
      />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 280,
    height: 77,
  },
  connectedBadge: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  connectedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#e2e8f0',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonConnected: {
    backgroundColor: '#06b6d4',
  },
  iconButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  logoutButton: {
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 60,
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#06b6d4',
    borderRadius: 32,
    padding: 60,
    width: 500,
    height: 350,
    justifyContent: 'space-between',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  relaxationCard: {
    backgroundColor: '#0891b2',
    opacity: 0.9,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 2,
  },
  cardSubtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardIcon: {
    alignSelf: 'flex-end',
  },
  iconText: {
    fontSize: 96,
  },
  attentionCircleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

