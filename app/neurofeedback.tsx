import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrainWaveData, MentalState } from '../types';
import { BottomBar } from '../components/BottomBar';
import { BrainLinkConnection } from '../components/BrainLinkConnection';
import { useBrainLink } from '../hooks/useBrainLink';

export default function NeurofeedbackScreen() {
  const router = useRouter();
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  
  const {
    isConnected,
    isScanning,
    devices,
    brainWaveData: realBrainWaveData,
    mentalState: realMentalState,
    startScanning,
    stopScanning,
    connect,
    disconnect,
  } = useBrainLink();

  const [mockBrainWaveData, setMockBrainWaveData] = useState<BrainWaveData>({
    delta: 45,
    theta: 55,
    loAlpha: 60,
    hiAlpha: 65,
    loBeta: 50,
    hiBeta: 70,
    loGamma: 40,
    hiGamma: 35,
  });

  const [mockMentalState, setMockMentalState] = useState<MentalState>({
    attention: 72,
    relaxation: 65,
  });

  // Use real or mock data based on connection status
  const brainWaveData = isConnected ? realBrainWaveData : mockBrainWaveData;
  const mentalState = isConnected ? realMentalState : mockMentalState;

  // Simulate real-time data updates when not connected
  useEffect(() => {
    if (!isConnected && useMockData) {
      const interval = setInterval(() => {
        setMockBrainWaveData({
          delta: Math.random() * 100,
          theta: Math.random() * 100,
          loAlpha: Math.random() * 100,
          hiAlpha: Math.random() * 100,
          loBeta: Math.random() * 100,
          hiBeta: Math.random() * 100,
          loGamma: Math.random() * 100,
          hiGamma: Math.random() * 100,
        });

        setMockMentalState({
          attention: Math.random() * 100,
          relaxation: Math.random() * 100,
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isConnected, useMockData]);

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
          <Text style={styles.title}>NEUROFEEDBACK</Text>
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

      <BottomBar brainWaveData={brainWaveData} mentalState={mentalState} />
      
      <BrainLinkConnection
        visible={showConnectionModal}
        isScanning={isScanning}
        isConnected={isConnected}
        devices={devices}
        onClose={() => setShowConnectionModal(false)}
        onScan={startScanning}
        onConnect={connect}
        onDisconnect={handleDisconnect}
      />
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  connectedBadge: {
    backgroundColor: '#4CAF50',
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
    backgroundColor: '#2a2a3e',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonConnected: {
    backgroundColor: '#4CAF50',
  },
  iconButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  logoutButton: {
    padding: 12,
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    padding: 40,
    width: 350,
    height: 250,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  relaxationCard: {
    backgroundColor: '#4ECDC4',
    opacity: 0.6,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardIcon: {
    alignSelf: 'flex-end',
  },
  iconText: {
    fontSize: 64,
  },
});

