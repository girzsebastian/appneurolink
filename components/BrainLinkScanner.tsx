import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Device } from 'react-native-ble-plx';

interface BrainLinkScannerProps {
  isScanning: boolean;
  devices: Device[];
  onScan: () => void;
  onConnect: (device: Device) => void;
}

export const BrainLinkScanner: React.FC<BrainLinkScannerProps> = ({
  isScanning,
  devices,
  onScan,
  onConnect,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isScanning && styles.buttonDisabled]}
        onPress={onScan}
        disabled={isScanning}
      >
        <Text style={styles.buttonText}>
          {isScanning ? 'Scanning...' : 'Scan for BrainLink'}
        </Text>
      </TouchableOpacity>

      {isScanning && (
        <View style={styles.scanningInfo}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={styles.scanningText}>Looking for BrainLink devices...</Text>
        </View>
      )}

      {devices.length > 0 && (
        <View style={styles.deviceList}>
          <Text style={styles.deviceListTitle}>Found Devices:</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deviceItem}
                onPress={() => onConnect(item)}
              >
                <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scanningInfo: {
    alignItems: 'center',
    marginTop: 30,
    gap: 15,
  },
  scanningText: {
    color: '#fff',
    fontSize: 16,
  },
  deviceList: {
    marginTop: 30,
  },
  deviceListTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  deviceItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceId: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});

