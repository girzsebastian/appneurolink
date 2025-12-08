import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BrainLinkDevice } from '../types';
import { CustomButton } from './CustomButton';

interface BrainLinkConnectionProps {
  visible: boolean;
  isScanning: boolean;
  isConnected: boolean;
  devices: BrainLinkDevice[];
  onClose: () => void;
  onScan: () => void;
  onConnect: (deviceId: string) => void;
  onDisconnect: () => void;
}

export const BrainLinkConnection: React.FC<BrainLinkConnectionProps> = ({
  visible,
  isScanning,
  isConnected,
  devices,
  onClose,
  onScan,
  onConnect,
  onDisconnect,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>BrainLink Connection</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isConnected ? (
            <View style={styles.connectedContainer}>
              <View style={styles.statusIcon}>
                <Text style={styles.statusIconText}>✓</Text>
              </View>
              <Text style={styles.connectedText}>Connected to BrainLink</Text>
              <Text style={styles.connectedSubtext}>
                Receiving brain wave data in real-time
              </Text>
              <CustomButton
                title="Disconnect"
                onPress={onDisconnect}
                variant="secondary"
              />
            </View>
          ) : (
            <>
              <View style={styles.scanContainer}>
                <CustomButton
                  title={isScanning ? 'Scanning...' : 'Scan for Devices'}
                  onPress={onScan}
                  loading={isScanning}
                  disabled={isScanning}
                />
              </View>

              {isScanning && (
                <View style={styles.scanningInfo}>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text style={styles.scanningText}>
                    Looking for BrainLink devices...
                  </Text>
                </View>
              )}

              <View style={styles.deviceList}>
                <Text style={styles.deviceListTitle}>
                  Available Devices ({devices.length})
                </Text>
                
                {devices.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      {isScanning
                        ? 'Searching for devices...'
                        : 'No devices found. Make sure your BrainLink headset is turned on and in range.'}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.deviceItem}
                        onPress={() => onConnect(item.id)}
                      >
                        <View style={styles.deviceInfo}>
                          <Text style={styles.deviceName}>{item.name}</Text>
                          <Text style={styles.deviceId}>{item.id}</Text>
                        </View>
                        <View style={styles.connectIcon}>
                          <Text style={styles.connectIconText}>→</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    style={styles.flatList}
                  />
                )}
              </View>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              ℹ️ Ensure Bluetooth is enabled and your BrainLink headset is charged
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 600,
    maxHeight: '80%',
    backgroundColor: '#1e1e2e',
    borderRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2a2a3e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#888',
  },
  connectedContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconText: {
    fontSize: 48,
    color: '#fff',
  },
  connectedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  connectedSubtext: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
    textAlign: 'center',
  },
  scanContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scanningInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  scanningText: {
    color: '#888',
    fontSize: 14,
  },
  deviceList: {
    flex: 1,
    marginBottom: 16,
  },
  deviceListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  flatList: {
    flex: 1,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
  },
  connectIcon: {
    marginLeft: 12,
  },
  connectIconText: {
    fontSize: 24,
    color: '#4CAF50',
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});

