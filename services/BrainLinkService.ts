import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { BrainWaveData, MentalState } from '../types';

class BrainLinkService {
  private manager: BleManager;
  private device: Device | null = null;
  private characteristic: Characteristic | null = null;
  
  // BrainLink device identifiers
  private readonly DEVICE_NAME = 'BrainLink';
  private readonly SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
  private readonly CHARACTERISTIC_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';

  private dataCallback: ((data: BrainWaveData, mentalState: MentalState) => void) | null = null;

  constructor() {
    this.manager = new BleManager();
  }

  /**
   * Initialize Bluetooth and check permissions
   */
  async initialize(): Promise<boolean> {
    try {
      const state = await this.manager.state();
      console.log('Bluetooth state:', state);
      
      if (state !== 'PoweredOn') {
        console.warn('Bluetooth is not powered on');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing BLE:', error);
      return false;
    }
  }

  /**
   * Scan for BrainLink devices
   */
  async scanForDevices(callback: (device: Device) => void): Promise<void> {
    console.log('Scanning for BrainLink devices...');
    
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        return;
      }

      if (device && device.name && device.name.includes(this.DEVICE_NAME)) {
        console.log('Found BrainLink device:', device.name, device.id);
        callback(device);
      }
    });
  }

  /**
   * Stop scanning for devices
   */
  stopScanning(): void {
    this.manager.stopDeviceScan();
    console.log('Stopped scanning');
  }

  /**
   * Connect to a BrainLink device
   */
  async connect(deviceId: string): Promise<boolean> {
    try {
      console.log('Connecting to device:', deviceId);
      this.stopScanning();

      this.device = await this.manager.connectToDevice(deviceId);
      console.log('Connected to device');

      await this.device.discoverAllServicesAndCharacteristics();
      console.log('Services discovered');

      // Start monitoring data
      this.startMonitoring();

      return true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  }

  /**
   * Disconnect from the current device
   */
  async disconnect(): Promise<void> {
    try {
      if (this.device) {
        await this.manager.cancelDeviceConnection(this.device.id);
        this.device = null;
        this.characteristic = null;
        console.log('Disconnected from device');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  /**
   * Start monitoring BrainLink data
   */
  private async startMonitoring(): Promise<void> {
    if (!this.device) return;

    try {
      this.device.monitorCharacteristicForService(
        this.SERVICE_UUID,
        this.CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            const data = this.parseData(characteristic.value);
            if (this.dataCallback) {
              this.dataCallback(data.brainWaves, data.mentalState);
            }
          }
        }
      );

      console.log('Started monitoring BrainLink data');
    } catch (error) {
      console.error('Error starting monitoring:', error);
    }
  }

  /**
   * Parse BrainLink data from base64 string
   */
  private parseData(base64Data: string): {
    brainWaves: BrainWaveData;
    mentalState: MentalState;
  } {
    try {
      // Decode base64 data
      const decoded = atob(base64Data);
      const bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
      }

      // Parse BrainLink protocol
      // Note: This is a simplified parser. Actual BrainLink protocol may vary
      const brainWaves: BrainWaveData = {
        delta: this.parseValue(bytes, 0),
        theta: this.parseValue(bytes, 3),
        loAlpha: this.parseValue(bytes, 6),
        hiAlpha: this.parseValue(bytes, 9),
        loBeta: this.parseValue(bytes, 12),
        hiBeta: this.parseValue(bytes, 15),
        loGamma: this.parseValue(bytes, 18),
        hiGamma: this.parseValue(bytes, 21),
      };

      // Calculate mental state from brain waves
      const mentalState: MentalState = {
        attention: this.calculateAttention(brainWaves),
        relaxation: this.calculateRelaxation(brainWaves),
      };

      return { brainWaves, mentalState };
    } catch (error) {
      console.error('Error parsing data:', error);
      // Return default values on error
      return {
        brainWaves: {
          delta: 0,
          theta: 0,
          loAlpha: 0,
          hiAlpha: 0,
          loBeta: 0,
          hiBeta: 0,
          loGamma: 0,
          hiGamma: 0,
        },
        mentalState: {
          attention: 0,
          relaxation: 0,
        },
      };
    }
  }

  /**
   * Parse a 3-byte value from the data array
   */
  private parseValue(bytes: Uint8Array, offset: number): number {
    if (offset + 2 >= bytes.length) return 0;
    
    const value = (bytes[offset] << 16) | (bytes[offset + 1] << 8) | bytes[offset + 2];
    // Normalize to 0-100 range
    return Math.min(100, (value / 16777215) * 100);
  }

  /**
   * Calculate attention level from brain waves
   */
  private calculateAttention(waves: BrainWaveData): number {
    // Attention is typically associated with beta waves
    const attention = (waves.loBeta * 0.4 + waves.hiBeta * 0.6) * 
                     (1 - (waves.delta * 0.3 + waves.theta * 0.2) / 100);
    return Math.max(0, Math.min(100, attention));
  }

  /**
   * Calculate relaxation level from brain waves
   */
  private calculateRelaxation(waves: BrainWaveData): number {
    // Relaxation is typically associated with alpha waves
    const relaxation = (waves.loAlpha * 0.5 + waves.hiAlpha * 0.5) * 
                       (1 - (waves.loBeta * 0.2 + waves.hiBeta * 0.2) / 100);
    return Math.max(0, Math.min(100, relaxation));
  }

  /**
   * Set callback for data updates
   */
  setDataCallback(callback: (data: BrainWaveData, mentalState: MentalState) => void): void {
    this.dataCallback = callback;
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.device !== null;
  }

  /**
   * Get current device
   */
  getCurrentDevice(): Device | null {
    return this.device;
  }
}

// Export singleton instance
export const brainLinkService = new BrainLinkService();

