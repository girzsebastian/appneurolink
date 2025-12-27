import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BrainWaveData, MentalState } from '../types';
import { CircularProgress } from './CircularProgress';

interface BottomBarProps {
  brainWaveData: BrainWaveData;
  mentalState: MentalState;
  isConnected?: boolean;
  isReceivingData?: boolean;
  rawEegData?: number[];
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BAR_HEIGHT = SCREEN_HEIGHT * 0.4; // Reduced from 0.6 to 0.4 for slimmer popup

export const BottomBar: React.FC<BottomBarProps> = ({ 
  brainWaveData, 
  mentalState,
  isConnected = false,
  isReceivingData = false,
  rawEegData = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Mutually exclusive: only one can be active at a time
  // Default to brain waves (true) if both are false
  const [showRawEEG, setShowRawEEG] = useState(false);
  const [showBrainWaves, setShowBrainWaves] = useState(true);
  const [translateY] = useState(new Animated.Value(BAR_HEIGHT - 60));
  const [eegData, setEegData] = useState<number[]>([]);
  const eegIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle between brain waves and raw eeg (mutually exclusive)
  const handleToggleBrainWaves = (value: boolean) => {
    if (value) {
      setShowBrainWaves(true);
      setShowRawEEG(false);
    } else {
      // If turning off brain waves, ensure raw eeg is on
      setShowBrainWaves(false);
      setShowRawEEG(true);
    }
  };

  const handleToggleRawEEG = (value: boolean) => {
    if (value) {
      setShowRawEEG(true);
      setShowBrainWaves(false);
    } else {
      // If turning off raw eeg, ensure brain waves is on
      setShowRawEEG(false);
      setShowBrainWaves(true);
    }
  };

  const toggleBar = () => {
    const toValue = isExpanded ? BAR_HEIGHT - 60 : 0;
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
    setIsExpanded(!isExpanded);
  };

  // Use real device data or generate mock data
  useEffect(() => {
    if (showRawEEG && isExpanded) {
      if (isConnected && isReceivingData && rawEegData.length > 0) {
        // Use real data from device
        // Normalize and scale the raw data for display
        const normalizedData = rawEegData.map((value) => {
          // Scale to visible range (-50 to 50)
          return (value / 128) * 50;
        });
        setEegData(normalizedData);
      } else if (!isConnected || !isReceivingData) {
        // Stop showing data if device is not connected or not receiving
        setEegData([]);
        if (eegIntervalRef.current) {
          clearInterval(eegIntervalRef.current);
          eegIntervalRef.current = null;
        }
      } else {
        // Generate mock data only if not connected
        const initialData = Array.from({ length: 100 }, (_, i) => {
          return Math.sin(i * 0.2) * 30 + Math.sin(i * 0.5) * 15;
        });
        setEegData(initialData);

        // Update waveform every 50ms for smooth animation
        eegIntervalRef.current = setInterval(() => {
          setEegData((prev) => {
            const newData = [...prev.slice(1)];
            const time = Date.now() / 100;
            const newPoint = Math.sin(time * 0.2) * 30 + 
                            Math.sin(time * 0.5) * 15 + 
                            (Math.random() - 0.5) * 10;
            newData.push(newPoint);
            return newData;
          });
        }, 50);
      }
    } else {
      if (eegIntervalRef.current) {
        clearInterval(eegIntervalRef.current);
        eegIntervalRef.current = null;
      }
    }

    return () => {
      if (eegIntervalRef.current) {
        clearInterval(eegIntervalRef.current);
      }
    };
  }, [showRawEEG, isExpanded, isConnected, isReceivingData, rawEegData]);

  const waveTypes = [
    { name: 'Delta', value: brainWaveData.delta, color: '#E91E63' },
    { name: 'Theta', value: brainWaveData.theta, color: '#9C27B0' },
    { name: 'Lo Alpha', value: brainWaveData.loAlpha, color: '#3F51B5' },
    { name: 'Hi Alpha', value: brainWaveData.hiAlpha, color: '#2196F3' },
    { name: 'Lo Beta', value: brainWaveData.loBeta, color: '#00BCD4' },
    { name: 'Hi Beta', value: brainWaveData.hiBeta, color: '#009688' },
    { name: 'Lo Gamma', value: brainWaveData.loGamma, color: '#4CAF50' },
    { name: 'Hi Gamma', value: brainWaveData.hiGamma, color: '#8BC34A' },
  ];

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Single Row: Brain Waves/Raw EEG | Attention | Relaxation */}
        <View style={styles.singleRow}>
          {/* Column 1: Brain Waves OR Raw EEG (mutually exclusive) */}
          <View style={styles.column1}>
            <View style={styles.toggleHeader}>
              <TouchableOpacity
                style={[styles.toggleButton, showBrainWaves && styles.toggleButtonActive]}
                onPress={() => handleToggleBrainWaves(true)}
              >
                <Text style={[styles.toggleText, showBrainWaves && styles.toggleTextActive]}>
                  Brain Waves
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, showRawEEG && styles.toggleButtonActive]}
                onPress={() => handleToggleRawEEG(true)}
              >
                <Text style={[styles.toggleText, showRawEEG && styles.toggleTextActive]}>
                  Raw EEG
                </Text>
              </TouchableOpacity>
            </View>

            {/* Show Brain Waves */}
            {showBrainWaves && (
              <View style={styles.verticalBarsContainer}>
                {waveTypes.map((wave) => (
                  <View key={wave.name} style={styles.verticalBarWrapper}>
                    <Text style={styles.waveLabel}>{wave.name}</Text>
                    <View style={styles.verticalBarContainer}>
                      <View
                        style={[
                          styles.verticalBar,
                          {
                            height: `${wave.value}%`,
                            backgroundColor: wave.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.waveValue}>{wave.value.toFixed(0)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Show Raw EEG */}
            {showRawEEG && (
              <View style={styles.rawEEGContainer}>
                {isConnected && isReceivingData ? (
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDotActive} />
                    <Text style={styles.statusText}>Receiving</Text>
                  </View>
                ) : (
                  <View style={[styles.statusBadge, styles.statusBadgeInactive]}>
                    <View style={styles.statusDotInactive} />
                    <Text style={styles.statusTextInactive}>
                      {!isConnected ? 'Not Connected' : 'No Data'}
                    </Text>
                  </View>
                )}
                {isConnected && isReceivingData && eegData.length > 0 ? (
                  <View style={styles.eegWaveform}>
                    {eegData.map((amplitude, i) => (
                      <View
                        key={i}
                        style={[
                          styles.eegBar,
                          {
                            height: Math.abs(amplitude) + 5,
                            backgroundColor: amplitude > 0 ? '#4ECDC4' : '#FF6B6B',
                          },
                        ]}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.eegWaveformPlaceholder}>
                    <Text style={styles.placeholderText}>
                      {!isConnected 
                        ? 'Connect device to see Raw EEG signal' 
                        : 'Waiting for data from device...'}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Column 2: Attention */}
          <View style={styles.column2}>
            <Text style={styles.columnTitle}>Attention</Text>
            <CircularProgress
              value={mentalState.attention}
              label="Attention"
              color="#FF6B6B"
              size={100}
            />
          </View>

          {/* Column 3: Relaxation */}
          <View style={styles.column3}>
            <Text style={styles.columnTitle}>Relaxation</Text>
            <CircularProgress
              value={mentalState.relaxation}
              label="Relaxation"
              color="#4ECDC4"
              size={100}
            />
          </View>
        </View>
      </ScrollView>
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
  },
  singleRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  column1: {
    flex: 3.5, // Increased from 2 to 3.5 for larger Brain Waves/Raw EEG column
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 12,
  },
  column2: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column3: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleHeader: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#2a2a3e',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#fff',
  },
  columnTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  // Column 1: Vertical Brain Waves Bars
  verticalBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140, // Reduced from 200 to 140 for slimmer popup
    paddingHorizontal: 6,
  },
  verticalBarWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  waveLabel: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  verticalBarContainer: {
    width: '80%',
    height: 100, // Reduced from 150 to 100
    backgroundColor: '#2a2a3e',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  verticalBar: {
    width: '100%',
    minHeight: 4,
    borderRadius: 4,
    transition: 'height 0.3s ease',
  },
  waveValue: {
    color: '#888',
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Column 2: Switches
  switchesContainer: {
    gap: 24,
    marginBottom: 20,
  },
  switchItem: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    padding: 12,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  switchStatus: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
  },
  rawEEGContainer: {
    padding: 10,
    backgroundColor: '#16161e',
    borderRadius: 8,
    height: 140, // Reduced from 200 to 140 to match brain waves height
    justifyContent: 'center',
  },
  rawEEGHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rawEEGTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeInactive: {
    backgroundColor: '#3a3a4e',
  },
  statusDotActive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  statusDotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#888',
    marginRight: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  statusTextInactive: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
  },
  eegWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60, // Reduced from 80 to 60
    marginVertical: 6,
    paddingVertical: 6,
    backgroundColor: '#0f0f1e',
    borderRadius: 6,
    overflow: 'hidden',
  },
  eegBar: {
    width: 2,
    marginHorizontal: 0.3,
    borderRadius: 1,
  },
  eegWaveformPlaceholder: {
    height: 60, // Reduced from 80 to 60
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: 6,
    marginVertical: 6,
  },
  placeholderText: {
    color: '#666',
    fontSize: 11,
    textAlign: 'center',
  },
});
