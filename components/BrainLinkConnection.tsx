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

interface BrainLinkConnectionProps {
  visible: boolean;
  isScanning: boolean;
  isConnected: boolean;
  devices: any[];
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
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={onDisconnect}
              >
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
                onPress={onScan}
                disabled={isScanning}
              >
                <Text style={styles.scanButtonText}>
                  {isScanning ? 'Scanning...' : 'Scan for BrainLink'}
                </Text>
              </TouchableOpacity>

              {isScanning && (
                <View style={styles.scanningInfo}>
                  <ActivityIndicator size="large" color="#00ff00" />
                  <Text style={styles.scanningText}>
                    Looking for BrainLink devices...
                  </Text>
                </View>
              )}

              {devices.length > 0 && (
                <View style={styles.deviceList}>
                  <Text style={styles.deviceListTitle}>
                    Found Devices:
                  </Text>
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.deviceItem}
                        onPress={() => onConnect(item.id)}
                      >
                        <Text style={styles.deviceName}>
                          {item.name || 'Unknown Device'}
                        </Text>
                        <Text style={styles.deviceId}>{item.id}</Text>
                      </TouchableOpacity>
                    )}
                    style={styles.flatList}
                  />
                </View>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '85%',
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  connectedContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00ff00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIconText: {
    fontSize: 60,
    color: '#0a0a0a',
    fontWeight: 'bold',
  },
  connectedText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  connectedSubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  disconnectButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#1e90ff',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  scanButtonDisabled: {
    backgroundColor: '#555',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scanningInfo: {
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  scanningText: {
    color: '#fff',
    fontSize: 16,
  },
  deviceList: {
    flex: 1,
  },
  deviceListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  flatList: {
    flex: 1,
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
    marginBottom: 4,
  },
  deviceId: {
    color: '#666',
    fontSize: 12,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

