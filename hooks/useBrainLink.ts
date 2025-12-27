import { useState, useEffect } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';

const bleManager = new BleManager();

export function useBrainLink() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [attention, setAttention] = useState(0);
  const [meditation, setMeditation] = useState(0);
  const [signal, setSignal] = useState(200); // 0 = good, 200 = no signal
  const [heartRate, setHeartRate] = useState(0); // Heart rate (BPM)
  
  // Brain Waves (8 frequency bands)
  const [delta, setDelta] = useState(0);
  const [theta, setTheta] = useState(0);
  const [lowAlpha, setLowAlpha] = useState(0);
  const [highAlpha, setHighAlpha] = useState(0);
  const [lowBeta, setLowBeta] = useState(0);
  const [highBeta, setHighBeta] = useState(0);
  const [lowGamma, setLowGamma] = useState(0);
  const [midGamma, setMidGamma] = useState(0);
  
  // Raw EEG Signal (for graph)
  const [rawEEG, setRawEEG] = useState<number[]>([]);

  useEffect(() => {
    // Request permissions on mount
    if (Platform.OS === 'android') {
      requestAndroidPermissions();
    }

    return () => {
      // Cleanup on unmount
      if (connectedDevice) {
        bleManager.cancelDeviceConnection(connectedDevice.id);
      }
    };
  }, []);

  // Debug: Log devices array changes
  useEffect(() => {
    console.log('🔄 Devices state changed:', devices.length, 'devices', devices.map(d => `${d.name}(${d.id})`));
  }, [devices]);

  const requestAndroidPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      
      console.log('📱 Permissions granted:', granted);
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      console.log('📱 Location permission:', granted);
    }
  };

  const startScan = async () => {
    console.log('🔍 Starting scan...');
    console.log('🔍 Current devices before scan:', devices.length);
    
    // First check permissions
    try {
      await requestAndroidPermissions();
    } catch (error) {
      console.error('❌ Permission error:', error);
    }
    
    setIsScanning(true);
    setDevices([]);
    console.log('🔍 Devices cleared, array length:', 0);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('❌ Scan error:', error);
        setIsScanning(false);
        return;
      }

      if (device && device.name && device.name.includes('BrainLink')) {
        console.log('✅ Found BrainLink:', device.name, device.id);
        setDevices((prev) => {
          console.log('📱 Previous devices:', prev.length);
          const exists = prev.find((d) => d.id === device.id);
          if (!exists) {
            const updated = [...prev, device];
            console.log('📱 Devices updated:', updated.length, 'devices', updated.map(d => d.name));
            return updated;
          }
          console.log('📱 Device already exists, not adding');
          return prev;
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
      console.log('⏹️ Scan stopped');
    }, 10000);
  };

  const connectToDevice = async (device: Device) => {
    try {
      console.log('🔗 Connecting to:', device.name);
      
      const connected = await bleManager.connectToDevice(device.id);
      console.log('✅ Connected to:', connected.name);
      
      setConnectedDevice(connected);
      setIsConnected(true);

      // Discover services and characteristics
      await connected.discoverAllServicesAndCharacteristics();
      console.log('✅ Services discovered');

      // Start monitoring data
      monitorData(connected);
    } catch (error) {
      console.error('❌ Connection failed:', error);
    }
  };

  const monitorData = async (device: Device) => {
    // BrainLink uses Nordic UART Service (NUS)
    const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const READ_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

    try {
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        READ_CHAR_UUID,
        (error, characteristic) => {
          try {
            if (error) {
              console.error('❌ Monitor error:', error);
              return;
            }

            if (characteristic?.value) {
              try {
                // Parse the raw data
                const bytes = base64ToBytes(characteristic.value);
                if (bytes && bytes.length > 0) {
                  parseData(bytes);
                }
              } catch (parseError) {
                console.error('❌ Parse error in callback:', parseError);
              }
            }
          } catch (callbackError) {
            console.error('❌ Callback error:', callbackError);
          }
        }
      );

      console.log('✅ Started monitoring data');
    } catch (error) {
      console.error('❌ Failed to start monitoring:', error);
    }
  };

  const base64ToBytes = (base64: string): number[] => {
    try {
      if (!base64 || typeof base64 !== 'string') {
        return [];
      }
      
      // Manual base64 decoding for React Native (no atob available)
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const bytes: number[] = [];
      
      // Remove padding and invalid chars
      base64 = base64.replace(/[^A-Za-z0-9\+\/]/g, '');
      
      if (base64.length === 0) {
        return [];
      }
      
      let i = 0;
      while (i < base64.length) {
        if (i + 3 >= base64.length) break; // Need at least 4 chars
        
        const encoded1 = chars.indexOf(base64.charAt(i++));
        const encoded2 = chars.indexOf(base64.charAt(i++));
        const encoded3 = chars.indexOf(base64.charAt(i++));
        const encoded4 = chars.indexOf(base64.charAt(i++));
        
        if (encoded1 === -1 || encoded2 === -1 || encoded3 === -1 || encoded4 === -1) {
          break; // Invalid base64
        }
        
        const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
        
        bytes.push((bitmap >> 16) & 255);
        if (encoded3 !== 64) bytes.push((bitmap >> 8) & 255);
        if (encoded4 !== 64) bytes.push(bitmap & 255);
      }
      
      return bytes;
    } catch (error) {
      console.error('❌ Base64 decode error:', error);
      return [];
    }
  };

  const parseData = (bytes: number[]) => {
    try {
      // Simple parser - looking for ThinkGear packets
      // Format: [0xAA, 0xAA, length, payload..., checksum]
      
      for (let i = 0; i < bytes.length - 2; i++) {
        if (bytes[i] === 0xAA && bytes[i + 1] === 0xAA) {
          const length = bytes[i + 2];
          
          if (length > 0 && length < 200 && i + 3 + length <= bytes.length) {
            const payload = bytes.slice(i + 3, i + 3 + length);
            
            // Parse payload
            for (let j = 0; j < payload.length - 1; j++) {
              const code = payload[j];
              
              if (code === 0x02 && j + 1 < payload.length) {
                // Signal quality (NO LOG)
                const signalValue = payload[j + 1];
                if (signalValue !== undefined && signalValue >= 0 && signalValue <= 255) {
                  setSignal(signalValue);
                }
                j += 1;
              } else if (code === 0x03 && j + 1 < payload.length) {
                // Heart Rate
                const hrValue = payload[j + 1];
                if (hrValue !== undefined && hrValue > 0 && hrValue < 255) {
                  setHeartRate(hrValue);
                  console.log('❤️ Heart Rate:', hrValue, 'BPM');
                }
                j += 1;
              } else if (code === 0x04 && j + 1 < payload.length) {
                // Attention
                const attentionValue = payload[j + 1];
                if (attentionValue !== undefined && attentionValue >= 0 && attentionValue <= 100) {
                  setAttention(attentionValue);
                  console.log('🎯 Attention:', attentionValue);
                }
                j += 1;
              } else if (code === 0x05 && j + 1 < payload.length) {
                // Meditation
                const meditationValue = payload[j + 1];
                if (meditationValue !== undefined && meditationValue >= 0 && meditationValue <= 100) {
                  setMeditation(meditationValue);
                  console.log('🧘 Meditation:', meditationValue);
                }
                j += 1;
              } else if (code === 0x80 && j + 2 < payload.length) {
                // Raw EEG Signal (2 bytes, signed 16-bit)
                const rawValue = (payload[j + 1] << 8) | payload[j + 2];
                const signedValue = rawValue > 32767 ? rawValue - 65536 : rawValue;
                
                setRawEEG(prev => {
                  const updated = [...prev, signedValue];
                  // Keep only last 100 samples for graph
                  return updated.slice(-100);
                });
                
                j += 2;
              } else if (code === 0x83 && j + 24 < payload.length) {
                // EEG Power (Brain Waves) - 8 bands x 3 bytes each = 24 bytes
                // Each value is a 24-bit unsigned integer (big-endian)
                j += 1; // Skip to data
                
                const deltaVal = (payload[j] << 16) | (payload[j + 1] << 8) | payload[j + 2];
                const thetaVal = (payload[j + 3] << 16) | (payload[j + 4] << 8) | payload[j + 5];
                const lowAlphaVal = (payload[j + 6] << 16) | (payload[j + 7] << 8) | payload[j + 8];
                const highAlphaVal = (payload[j + 9] << 16) | (payload[j + 10] << 8) | payload[j + 11];
                const lowBetaVal = (payload[j + 12] << 16) | (payload[j + 13] << 8) | payload[j + 14];
                const highBetaVal = (payload[j + 15] << 16) | (payload[j + 16] << 8) | payload[j + 17];
                const lowGammaVal = (payload[j + 18] << 16) | (payload[j + 19] << 8) | payload[j + 20];
                const midGammaVal = (payload[j + 21] << 16) | (payload[j + 22] << 8) | payload[j + 23];
                
                setDelta(deltaVal);
                setTheta(thetaVal);
                setLowAlpha(lowAlphaVal);
                setHighAlpha(highAlphaVal);
                setLowBeta(lowBetaVal);
                setHighBeta(highBetaVal);
                setLowGamma(lowGammaVal);
                setMidGamma(midGammaVal);
                
                console.log('🧠 Brain Waves:', {
                  delta: deltaVal,
                  theta: thetaVal,
                  lowAlpha: lowAlphaVal,
                  highAlpha: highAlphaVal,
                  lowBeta: lowBetaVal,
                  highBeta: highBetaVal,
                  lowGamma: lowGammaVal,
                  midGamma: midGammaVal,
                });
                
                j += 23; // Move to end of brain wave data
              } else {
                // Log unknown codes to debug battery
                console.log('❓ Unknown code:', '0x' + code.toString(16).toUpperCase(), 'at position', j);
                // Skip this byte and try next
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Parse error:', error);
    }
  };

  const disconnect = async () => {
    if (connectedDevice) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
        console.log('🔌 Disconnected');
        setConnectedDevice(null);
        setIsConnected(false);
        setAttention(0);
        setMeditation(0);
        setSignal(200);
        setHeartRate(0);
        
        // Reset brain waves
        setDelta(0);
        setTheta(0);
        setLowAlpha(0);
        setHighAlpha(0);
        setLowBeta(0);
        setHighBeta(0);
        setLowGamma(0);
        setMidGamma(0);
        
        // Reset raw EEG
        setRawEEG([]);
      } catch (error) {
        console.error('❌ Disconnect error:', error);
      }
    }
  };

  return {
    isScanning,
    isConnected,
    devices,
    attention,
    meditation,
    signal,
    heartRate, // Heart Rate instead of battery
    // Brain Waves
    delta,
    theta,
    lowAlpha,
    highAlpha,
    lowBeta,
    highBeta,
    lowGamma,
    midGamma,
    // Raw EEG
    rawEEG,
    startScan,
    connectToDevice,
    disconnect,
    requestPermissions: requestAndroidPermissions,
  };
}
