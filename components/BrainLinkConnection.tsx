import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
  onRequestPermissions?: () => Promise<void>;
  attention: number;
  meditation: number;
  signal: number;
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
  signal,
}) => {
  console.log('🎨 Modal render:', { devices: devices.length, isScanning, isConnected });

  const getSignalQuality = () => {
    if (signal < 50) return { text: 'Excellent', color: '#00ff00', bars: 4 };
    if (signal < 100) return { text: 'Good', color: '#ffff00', bars: 3 };
    if (signal < 150) return { text: 'Fair', color: '#ff9900', bars: 2 };
    if (signal < 200) return { text: 'Poor', color: '#ff0000', bars: 1 };
    return { text: 'No Signal', color: '#666', bars: 0 };
  };

  const signalQuality = getSignalQuality();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>BrainLink Connection</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Connected State */}
          {isConnected ? (
            <View style={styles.content}>
              <View style={styles.statusRow}>
                <View style={styles.connectedBadge}>
                  <View style={styles.greenDot} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
                
                <View style={styles.signalBadge}>
                  <View style={styles.signalBars}>
                    {[4, 8, 12, 16].map((height, i) => (
                      <View
                        key={i}
                        style={[
                          styles.signalBar,
                          { height },
                          i < signalQuality.bars && { backgroundColor: signalQuality.color }
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.signalText, { color: signalQuality.color }]}>
                    {signalQuality.text}
                  </Text>
                </View>
              </View>

              <Text style={styles.infoText}>Receiving brain wave data in real-time</Text>

              <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnect}>
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Not Connected */
            <View style={styles.content}>
              {/* Scan Button */}
              <TouchableOpacity
                style={styles.scanButton}
                onPress={onScan}
                disabled={isScanning}
              >
                {isScanning && (
                  <ActivityIndicator size="small" color="#0a0a0a" style={{ marginRight: 8 }} />
                )}
                <Text style={styles.scanButtonText}>
                  {isScanning ? 'Scanning...' : devices.length > 0 ? '🔄 Scan Again' : '🔍 Scan for Devices'}
                </Text>
              </TouchableOpacity>

              {/* Device List */}
              {devices.length > 0 && (
                <View style={styles.deviceListContainer}>
                  <Text style={styles.listTitle}>Found {devices.length} device(s)</Text>
                  <ScrollView style={styles.scrollView}>
                    {devices.map((device, index) => {
                      console.log('📱 Rendering device:', device.name, device.id);
                      return (
                        <View key={device.id || index} style={styles.deviceCard}>
                          <View style={styles.deviceInfo}>
                            <Text style={styles.deviceName}>{device.name || 'Unknown Device'}</Text>
                            <Text style={styles.deviceId}>{device.id}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.connectButton}
                            onPress={() => {
                              console.log('🔗 Connect pressed for:', device.id);
                              onConnect(device.id);
                            }}
                          >
                            <Text style={styles.connectButtonText}>Connect</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Empty State */}
              {!isScanning && devices.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyText}>No devices found</Text>
                  <Text style={styles.emptySubtext}>Tap scan button to search for BrainLink devices</Text>
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Ensure Bluetooth is enabled and device is charged
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxHeight: '80%',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#06b6d4',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#0891b2',
  },
  content: {
    minHeight: 300,
  },
  // Connected State
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06b6d4',
    marginRight: 8,
  },
  connectedText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '600',
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginRight: 8,
    height: 16,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#cbd5e1',
    borderRadius: 1.5,
  },
  signalText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  disconnectButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Scan Button
  scanButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Device List
  deviceListContainer: {
    flex: 1,
  },
  listTitle: {
    color: '#0891b2',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollView: {
    maxHeight: 250,
  },
  deviceCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  deviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  deviceName: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deviceId: {
    color: '#64748b',
    fontSize: 12,
  },
  connectButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#0891b2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // Footer
  footer: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'center',
  },
});
