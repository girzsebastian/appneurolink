import { useState, useEffect, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { brainLinkService } from '../services/BrainLinkService';
import { BrainWaveData, MentalState, BrainLinkDevice } from '../types';

export const useBrainLink = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BrainLinkDevice[]>([]);
  const [brainWaveData, setBrainWaveData] = useState<BrainWaveData>({
    delta: 0,
    theta: 0,
    loAlpha: 0,
    hiAlpha: 0,
    loBeta: 0,
    hiBeta: 0,
    loGamma: 0,
    hiGamma: 0,
  });
  const [mentalState, setMentalState] = useState<MentalState>({
    attention: 0,
    relaxation: 0,
  });

  /**
   * Request Bluetooth permissions (Android)
   */
  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Permission error:', error);
        return false;
      }
    }
    return true;
  };

  /**
   * Initialize BrainLink service
   */
  const initialize = useCallback(async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      Alert.alert(
        'Permissions Required',
        'Bluetooth and location permissions are required to connect to BrainLink headset.'
      );
      return false;
    }

    const initialized = await brainLinkService.initialize();
    if (!initialized) {
      Alert.alert('Bluetooth Error', 'Please enable Bluetooth to use BrainLink features.');
      return false;
    }

    // Set up data callback
    brainLinkService.setDataCallback((data, mental) => {
      setBrainWaveData(data);
      setMentalState(mental);
    });

    return true;
  }, []);

  /**
   * Start scanning for BrainLink devices
   */
  const startScanning = useCallback(async () => {
    const initialized = await initialize();
    if (!initialized) return;

    setIsScanning(true);
    setDevices([]);

    brainLinkService.scanForDevices((device) => {
      setDevices((prev) => {
        // Avoid duplicates
        if (prev.find((d) => d.id === device.id)) {
          return prev;
        }
        return [
          ...prev,
          {
            id: device.id,
            name: device.name || 'Unknown Device',
            isConnected: false,
          },
        ];
      });
    });

    // Auto-stop scanning after 10 seconds
    setTimeout(() => {
      stopScanning();
    }, 10000);
  }, [initialize]);

  /**
   * Stop scanning for devices
   */
  const stopScanning = useCallback(() => {
    brainLinkService.stopScanning();
    setIsScanning(false);
  }, []);

  /**
   * Connect to a specific device
   */
  const connect = useCallback(async (deviceId: string) => {
    try {
      const success = await brainLinkService.connect(deviceId);
      if (success) {
        setIsConnected(true);
        setDevices((prev) =>
          prev.map((d) => ({
            ...d,
            isConnected: d.id === deviceId,
          }))
        );
        Alert.alert('Connected', 'Successfully connected to BrainLink headset!');
      } else {
        Alert.alert('Connection Failed', 'Could not connect to the device. Please try again.');
      }
      return success;
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'An error occurred while connecting to the device.');
      return false;
    }
  }, []);

  /**
   * Disconnect from current device
   */
  const disconnect = useCallback(async () => {
    await brainLinkService.disconnect();
    setIsConnected(false);
    setDevices((prev) => prev.map((d) => ({ ...d, isConnected: false })));
  }, []);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      brainLinkService.stopScanning();
    };
  }, []);

  return {
    isConnected,
    isScanning,
    devices,
    brainWaveData,
    mentalState,
    startScanning,
    stopScanning,
    connect,
    disconnect,
    initialize,
  };
};

