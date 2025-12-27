import { Platform } from 'react-native';
import { BrainWaveData, MentalState } from '../types';

// Lazy load BleManager to avoid initialization errors
let BleManager: any = null;
let Device: any = null;
let Characteristic: any = null;

const getBleModule = () => {
  if (Platform.OS === 'web') {
    return null;
  }
  
  if (BleManager === null) {
    try {
      const bleModule = require('react-native-ble-plx');
      if (bleModule && bleModule.BleManager) {
        BleManager = bleModule.BleManager;
        Device = bleModule.Device;
        Characteristic = bleModule.Characteristic;
      }
    } catch (error) {
      console.warn('react-native-ble-plx not available:', error);
      BleManager = false; // Mark as failed to avoid retrying
    }
  }
  
  return BleManager;
};

class BrainLinkService {
  private manager: any;
  private device: any = null;
  private characteristic: any = null;
  
  // BrainLink device identifiers
  private readonly DEVICE_NAMES = ['BrainLink_Lite', 'BrainLink_Pro', 'BrainLink'];
  private readonly SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
  private readonly CHARACTERISTIC_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';

  private dataCallback: ((data: BrainWaveData, mentalState: MentalState) => void) | null = null;
  private rawEegCallback: ((rawData: number[]) => void) | null = null;
  private isReceivingData: boolean = false;
  private dataReceptionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Delay initialization to avoid errors during module load
    // The manager will be created when actually needed (lazy initialization)
    this.manager = null;
  }

  /**
   * Initialize BleManager if not already initialized
   */
  private ensureManager(): boolean {
    if (this.manager !== null) {
      return this.manager !== false;
    }

    const BleManagerClass = getBleModule();
    if (BleManagerClass && BleManagerClass !== false) {
      try {
        this.manager = new BleManagerClass();
        return true;
      } catch (error) {
        console.warn('Failed to create BleManager:', error);
        this.manager = false; // Mark as failed
        return false;
      }
    } else {
      this.manager = false; // Mark as unavailable
      return false;
    }
  }

  /**
   * Initialize Bluetooth and check permissions
   * Based on best practices from BLESampleExpo and react-native-ble-plx
   */
  async initialize(): Promise<boolean> {
    console.log('📡 Checking Bluetooth manager...');
    
    if (!this.ensureManager()) {
      console.error('❌ BleManager not available - Bluetooth module not loaded');
      console.error('   Possible causes:');
      console.error('   1. react-native-ble-plx not installed');
      console.error('   2. Native module not linked');
      console.error('   3. Running on web (BLE not supported)');
      return false;
    }
    console.log('✅ BleManager available');
    
    try {
      // Enable Bluetooth state monitoring (best practice from BLESampleExpo)
      this.manager.onStateChange((state: string) => {
        console.log('📡 Bluetooth state changed:', state);
        if (state === 'PoweredOff') {
          console.warn('⚠️ Bluetooth turned OFF - Connection may be lost');
          this.isReceivingData = false;
        } else if (state === 'PoweredOn') {
          console.log('✅ Bluetooth turned ON - Ready for connections');
        }
      });

      console.log('   Checking Bluetooth state (this may take a moment)...');
      const stateStartTime = Date.now();
      const state = await this.manager.state();
      const stateTime = Date.now() - stateStartTime;
      console.log(`   State check completed in ${stateTime}ms`);
      console.log('📡 Bluetooth state:', state);
      
      if (state === 'PoweredOn') {
        console.log('✅ Bluetooth is ON and ready');
        return true;
      } else if (state === 'PoweredOff') {
        console.error('❌ Bluetooth is OFF - Please turn on Bluetooth in device settings');
        return false;
      } else if (state === 'Unauthorized') {
        console.error('❌ Bluetooth permissions not granted');
        console.error('   Please grant Bluetooth permissions in device settings');
        return false;
      } else if (state === 'Unsupported') {
        console.error('❌ Bluetooth not supported on this device');
        return false;
      } else {
        console.warn('⚠️ Bluetooth state:', state, '- Waiting for Bluetooth to be ready...');
        console.warn('   This state usually means Bluetooth is initializing');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error checking Bluetooth state');
      console.error('   Error type:', error?.name || 'Unknown');
      console.error('   Error message:', error?.message || error);
      console.error('   Full error:', error);
      return false;
    }
  }

  /**
   * Scan for ALL available Bluetooth devices (not just BrainLink)
   */
  async scanForAllDevices(callback: (device: any) => void): Promise<void> {
    console.log('🔍 Starting scan for ALL available devices...');
    
    if (!this.ensureManager()) {
      console.error('❌ Cannot scan - BleManager not available');
      return;
    }
    
    console.log('📡 Step 1: Checking Bluetooth state...');
    try {
      const state = await this.manager.state();
      console.log('📡 Bluetooth state:', state);
      
      if (state !== 'PoweredOn') {
        console.error('❌ Bluetooth is not powered on. Current state:', state);
        console.log('   Please turn on Bluetooth in device settings');
        return;
      }
      console.log('✅ Step 1 complete: Bluetooth is ON');
    } catch (error: any) {
      console.error('❌ Step 1 failed: Error checking Bluetooth state');
      console.error('   Error:', error?.message || error);
      return;
    }
    
    console.log('📡 Step 2: Starting device scan...');
    let deviceCount = 0;
    
    try {
      this.manager.startDeviceScan(null, null, (error: any, device: any) => {
        if (error) {
          console.error('❌ Scan callback error:', error);
          console.error('   Error code:', error?.errorCode);
          console.error('   Error message:', error?.message);
          return;
        }

        if (!device) {
          return;
        }

        deviceCount++;
        
        // Log first 10 devices found
        if (deviceCount <= 10) {
          console.log(`📱 Device #${deviceCount}:`, device.name || 'Unknown', `(${device.id?.substring(0, 12)}...)`);
        } else if (deviceCount === 11) {
          console.log('📱 ... (showing first 10 devices, more may be found)');
        }

        // Call callback for ALL devices (not just BrainLink)
        callback(device);
      });
      
      console.log('✅ Step 2 complete: Scan started successfully');
      console.log('   Listening for devices...');
    } catch (error: any) {
      console.error('❌ Step 2 failed: Error starting scan');
      console.error('   Error:', error?.message || error);
    }
  }

  /**
   * Scan for BrainLink devices only
   */
  async scanForDevices(callback: (device: any) => void): Promise<void> {
    console.log(`🔍 Starting scan for BrainLink devices...`);
    
    if (!this.ensureManager()) {
      console.warn('BleManager not available');
      return;
    }
    
    try {
      const state = await this.manager.state();
      console.log('📡 Bluetooth state:', state);
      
      if (state !== 'PoweredOn') {
        console.error('❌ Bluetooth is not powered on. Current state:', state);
        return;
      }
    } catch (error: any) {
      console.error('❌ Error checking Bluetooth state:', error?.message || error);
      return;
    }
    
    // Start scanning - scan for all devices and filter
    this.manager.startDeviceScan(null, null, (error: any, device: any) => {
      if (error) {
        console.error('❌ Scan error:', error);
        return;
      }

      if (!device) {
        return;
      }

      // Check for BrainLink devices - be more flexible with name matching
      const deviceName = device.name ? device.name.trim() : '';
      const lowerName = deviceName.toLowerCase();
      
      // Match if name contains "brainlink" or matches any known BrainLink device name
      const isMatch = deviceName && (
        this.DEVICE_NAMES.some(name => lowerName === name.toLowerCase()) ||
        lowerName.includes('brainlink') ||
        lowerName.includes('brain link')
      );

      if (isMatch) {
        console.log(`✅ FOUND BrainLink DEVICE!`);
        console.log(`   Name: ${device.name}`);
        console.log(`   ID: ${device.id}`);
        console.log(`   RSSI: ${device.rssi} dBm`);
        console.log(`   Connectable: ${device.isConnectable ? 'Yes' : 'No'}`);
        callback(device);
      }
    });
    
    console.log('✅ Scan started successfully');
  }

  /**
   * Stop scanning for devices
   */
  stopScanning(): void {
    if (!this.manager || this.manager === false) {
      return;
    }
    this.manager.stopDeviceScan();
    console.log('Stopped scanning');
  }

  /**
   * Connect to a BrainLink device
   * Improved error handling and connection lifecycle management (based on BLESampleExpo patterns)
   */
  async connect(deviceId: string): Promise<boolean> {
    console.log('🔌 Attempting to connect to device:', deviceId);
    
    if (!this.ensureManager()) {
      console.error('❌ Cannot connect - BleManager not available');
      return false;
    }
    
    try {
      this.stopScanning();
      console.log('⏸️ Stopped scanning');

      // Set up device disconnection listener (best practice)
      this.manager.onDeviceDisconnected(deviceId, (error: any, device: any) => {
        if (error) {
          console.error('❌ Device disconnected with error:', error?.message || error);
        } else {
          console.warn('⚠️ Device disconnected:', device?.name || deviceId);
        }
        this.device = null;
        this.isReceivingData = false;
        if (this.dataReceptionTimeout) {
          clearTimeout(this.dataReceptionTimeout);
          this.dataReceptionTimeout = null;
        }
      });

      console.log('🔗 Connecting...');
      // Use autoConnect: false for better control (best practice)
      this.device = await this.manager.connectToDevice(deviceId, { autoConnect: false });
      console.log('✅ Device connection established!');
      console.log(`   Device name: ${this.device.name || 'Unknown'}`);
      console.log(`   Device ID: ${this.device.id}`);

      console.log('🔍 Discovering services and characteristics...');
      await this.device.discoverAllServicesAndCharacteristics();
      console.log('✅ Services and characteristics discovered');

      // Log device information
      const deviceInfo = await this.getDeviceInfo();
      if (deviceInfo) {
        console.log('📋 Device Information:');
        console.log(`   Services found: ${deviceInfo.services?.length || 0}`);
        deviceInfo.services?.forEach((service: any, index: number) => {
          console.log(`   Service ${index + 1}: ${service.uuid}`);
          if (service.characteristics) {
            console.log(`     Characteristics: ${service.characteristics.length}`);
          }
        });
      }

      // Start monitoring data
      console.log('📡 Starting data monitoring...');
      this.startMonitoring();
      
      console.log('✅✅✅ DEVICE FULLY CONNECTED AND READY!');
      console.log('📡 Waiting for real-time data from device...');
      console.log('   If no data appears, check:');
      console.log('   1. Device is sending data');
      console.log('   2. Service UUID matches: ' + this.SERVICE_UUID);
      console.log('   3. Characteristic UUID matches: ' + this.CHARACTERISTIC_UUID);

      return true;
    } catch (error: any) {
      console.error('❌❌❌ CONNECTION FAILED!');
      console.error('   Error type:', error?.name || 'Unknown');
      console.error('   Error message:', error?.message || error);
      console.error('   Full error:', error);
      
      // Clean up on connection failure
      this.device = null;
      this.isReceivingData = false;
      
      return false;
    }
  }

  /**
   * Disconnect from the current device
   */
  async disconnect(): Promise<void> {
    if (!this.manager || this.manager === false) {
      return;
    }
    
    try {
      if (this.device) {
        await this.manager.cancelDeviceConnection(this.device.id);
        this.device = null;
        this.characteristic = null;
        this.isReceivingData = false;
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
        (error: any, characteristic: any) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            // Mark that we're receiving data
            if (!this.isReceivingData) {
              console.log('═══════════════════════════════════════');
              console.log('✅✅✅ STARTED RECEIVING DATA!');
              console.log('═══════════════════════════════════════');
              console.log('📡 Real-time data stream active');
              console.log('   Device is sending brain wave data');
              this.isReceivingData = true;
            }
            
            // Log raw data for debugging (first few packets, then occasionally)
            if (Math.random() < 0.02) { // Log 2% of the time
              console.log('📡 Data packet received');
              console.log('   Length:', characteristic.value?.length || 0, 'bytes');
              console.log('   Sample (first 40 chars):', characteristic.value?.substring(0, 40) || 'N/A');
            }
            
            // Extract raw EEG waveform data
            try {
              const decoded = atob(characteristic.value);
              const rawEegValues = new Array(decoded.length);
              for (let i = 0; i < decoded.length; i++) {
                rawEegValues[i] = decoded.charCodeAt(i) - 128; // Center around 0
              }
              
              // Send raw EEG data if callback is set
              if (this.rawEegCallback) {
                // Send last 100 points for display
                const displayData = rawEegValues.slice(-100);
                this.rawEegCallback(displayData);
              }
            } catch (error) {
              console.error('Error extracting raw EEG:', error);
            }
            
            // Parse and send brain wave data
            const data = this.parseData(characteristic.value);
            if (this.dataCallback) {
              this.dataCallback(data.brainWaves, data.mentalState);
            }
          } else {
            // No data received - mark as not receiving
            this.isReceivingData = false;
          }
        }
      );

      console.log('✅ Started monitoring BrainLink data');
      console.log('📡 Service UUID:', this.SERVICE_UUID);
      console.log('📡 Characteristic UUID:', this.CHARACTERISTIC_UUID);
      console.log('⏳ Waiting for data packets...');
      
      // Try to read initial data to verify we can receive data
      setTimeout(async () => {
        try {
          const initialData = await this.readData();
          if (initialData) {
            console.log('✅ Successfully read initial data from device');
            console.log('📊 Data length:', initialData.length, 'bytes');
          } else {
            console.log('⚠️ Could not read initial data (device may use notifications only)');
          }
        } catch (error: any) {
          console.log('ℹ️ Initial read failed (device may use notifications only):', error?.message || error);
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting monitoring:', error);
    }
  }

  /**
   * Parse BrainLink data from base64 string
   * Based on BrainLink protocol: attention, meditation, delta, theta, lowAlpha, highAlpha, lowBeta, highBeta, lowGamma, highGamma
   * Each value is typically 1-2 bytes, in a specific order
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

      // Log raw bytes for debugging (first few packets only)
      if (Math.random() < 0.01) {
        console.log(`📊 Parsing ${bytes.length} bytes`);
        console.log('   Raw bytes (first 20):', Array.from(bytes.slice(0, 20)).map(b => `0x${b.toString(16).padStart(2, '0')}`).join(' '));
      }

      let brainWaves: BrainWaveData;
      let attention = 0;
      let meditation = 0; // We call it relaxation

      // Try different BrainLink protocol formats
      if (bytes.length >= 20) {
        // Format 1: Each value is 2 bytes (little-endian or big-endian)
        // Order: attention(2), meditation(2), delta(2), theta(2), lowAlpha(2), highAlpha(2), lowBeta(2), highBeta(2), lowGamma(2), highGamma(2)
        try {
          attention = this.parseValue2Bytes(bytes, 0);
          meditation = this.parseValue2Bytes(bytes, 2);
          brainWaves = {
            delta: this.parseValue2Bytes(bytes, 4),
            theta: this.parseValue2Bytes(bytes, 6),
            loAlpha: this.parseValue2Bytes(bytes, 8),
            hiAlpha: this.parseValue2Bytes(bytes, 10),
            loBeta: this.parseValue2Bytes(bytes, 12),
            hiBeta: this.parseValue2Bytes(bytes, 14),
            loGamma: this.parseValue2Bytes(bytes, 16),
            hiGamma: this.parseValue2Bytes(bytes, 18),
          };
        } catch (e) {
          // Try alternative format
          attention = bytes[0] || 0;
          meditation = bytes[1] || 0;
          brainWaves = {
            delta: bytes[2] || 0,
            theta: bytes[3] || 0,
            loAlpha: bytes[4] || 0,
            hiAlpha: bytes[5] || 0,
            loBeta: bytes[6] || 0,
            hiBeta: bytes[7] || 0,
            loGamma: bytes[8] || 0,
            hiGamma: bytes[9] || 0,
          };
        }
      } else if (bytes.length >= 10) {
        // Format 2: Each value is 1 byte
        // Order: attention, meditation, delta, theta, lowAlpha, highAlpha, lowBeta, highBeta, lowGamma, highGamma
        attention = bytes[0] || 0;
        meditation = bytes[1] || 0;
        brainWaves = {
          delta: bytes[2] || 0,
          theta: bytes[3] || 0,
          loAlpha: bytes[4] || 0,
          hiAlpha: bytes[5] || 0,
          loBeta: bytes[6] || 0,
          hiBeta: bytes[7] || 0,
          loGamma: bytes[8] || 0,
          hiGamma: bytes[9] || 0,
        };
      } else {
        // Fallback: try to extract what we can
        console.warn('⚠️ Unexpected data length:', bytes.length, 'bytes');
        attention = bytes[0] || 0;
        meditation = bytes[1] || 0;
        brainWaves = {
          delta: bytes[2] || 0,
          theta: bytes[3] || 0,
          loAlpha: bytes[4] || 0,
          hiAlpha: bytes[5] || 0,
          loBeta: bytes[6] || 0,
          hiBeta: bytes[7] || 0,
          loGamma: bytes[8] || 0,
          hiGamma: bytes[9] || 0,
        };
      }

      // Use attention/meditation from device if available, otherwise calculate
      const mentalState: MentalState = {
        attention: attention > 0 ? attention : this.calculateAttention(brainWaves),
        relaxation: meditation > 0 ? meditation : this.calculateRelaxation(brainWaves),
      };

      // Log parsed data (occasionally)
      if (Math.random() < 0.01) {
        console.log('🧠 Parsed BrainLink Data:');
        console.log(`   Attention: ${mentalState.attention.toFixed(1)}`);
        console.log(`   Meditation/Relaxation: ${mentalState.relaxation.toFixed(1)}`);
        console.log(`   Delta: ${brainWaves.delta.toFixed(1)}, Theta: ${brainWaves.theta.toFixed(1)}`);
        console.log(`   Alpha: ${(brainWaves.loAlpha + brainWaves.hiAlpha).toFixed(1)}, Beta: ${(brainWaves.loBeta + brainWaves.hiBeta).toFixed(1)}`);
      }

      return { brainWaves, mentalState };
    } catch (error: any) {
      console.error('❌ Error parsing brain wave data:', error?.message || error);
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
   * Parse a 2-byte value from the data array
   * Supports both little-endian and big-endian formats
   */
  private parseValue2Bytes(bytes: Uint8Array, offset: number): number {
    if (offset + 1 >= bytes.length) return 0;
    
    // Try little-endian first (common in BLE)
    const valueLE = bytes[offset] | (bytes[offset + 1] << 8);
    // Try big-endian
    const valueBE = (bytes[offset] << 8) | bytes[offset + 1];
    
    // Use the value that makes more sense (0-100 range)
    const value = valueLE <= 100 ? valueLE : (valueBE <= 100 ? valueBE : valueLE);
    
    // Normalize to 0-100 range if needed
    if (value > 100) {
      return Math.min(100, (value / 65535) * 100);
    }
    return value;
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
   * Set callback for raw EEG data updates
   */
  setRawEegCallback(callback: (rawData: number[]) => void): void {
    this.rawEegCallback = callback;
  }

  /**
   * Check if device is receiving data
   */
  isReceivingDataFromDevice(): boolean {
    return this.isReceivingData && this.device !== null;
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.device !== null;
  }

  /**
   * Check for already paired/connected devices (no scanning needed)
   * This only checks devices that are already connected at the system level
   */
  async checkConnectedDevices(): Promise<any[]> {
    if (!this.ensureManager()) {
      console.log('⚠️ BleManager not available for checking connected devices');
      return [];
    }

    try {
      console.log('🔍 Checking for paired/connected devices (no scanning)...');
      const state = await this.manager.state();
      
      if (state !== 'PoweredOn') {
        console.log('⚠️ Bluetooth is not powered on. State:', state);
        return [];
      }

      // Get all currently connected devices (no scanning, just check what's already connected)
      console.log('   Checking all currently connected Bluetooth devices...');
      let connectedDevices: any[] = [];
      
      try {
        // Get all connected devices (empty array means all devices)
        const allConnected = await this.manager.connectedDevices([]);
        console.log(`   Found ${allConnected.length} total connected device(s) at system level`);
        
        if (allConnected.length > 0) {
          // Log all connected devices
          allConnected.forEach((device: any, index: number) => {
            const name = device.name || 'Unknown';
            console.log(`     ${index + 1}. ${name} (ID: ${device.id?.substring(0, 12)}...)`);
          });
          
          // Filter for BrainLink devices
          const brainLinkDevices = allConnected.filter((device: any) => {
            const name = device.name ? device.name.trim().toLowerCase() : '';
            return this.DEVICE_NAMES.some(n => name === n.toLowerCase()) ||
                   name.includes('brainlink') ||
                   name.includes('brain link');
          });
          
          if (brainLinkDevices.length > 0) {
            console.log(`   ✅ Found ${brainLinkDevices.length} BrainLink device(s) in connected devices`);
            connectedDevices = brainLinkDevices;
          } else {
            console.log('   ℹ️ No BrainLink devices found in connected devices');
          }
        } else {
          console.log('   ℹ️ No devices currently connected at system level');
        }
      } catch (error: any) {
        console.error('   ❌ Error checking connected devices:', error?.message || error);
        return [];
      }

      // If we found a BrainLink device, set it up
      if (connectedDevices.length > 0) {
        const brainLinkDevice = connectedDevices[0]; // Use the first one found
        console.log('═══════════════════════════════════════');
        console.log('✅✅✅ FOUND PAIRED BrainLink DEVICE!');
        console.log(`   Name: ${brainLinkDevice.name}`);
        console.log(`   ID: ${brainLinkDevice.id}`);
        console.log('═══════════════════════════════════════');
        
        try {
          // Connect to the device (it's already paired, just need app-level connection)
          console.log('   Establishing app-level connection to paired device...');
          this.device = await this.manager.connectToDevice(brainLinkDevice.id, { autoConnect: false });
          console.log('   ✅ App-level connection established');
          
          // Discover services and characteristics
          console.log('   Discovering services and characteristics...');
          await this.device.discoverAllServicesAndCharacteristics();
          console.log('   ✅ Services and characteristics discovered');
          
          // Check device info
          const deviceInfo = await this.getDeviceInfo();
          if (deviceInfo) {
            console.log('   📋 Device Information:');
            console.log(`      Services: ${deviceInfo.services?.length || 0}`);
            deviceInfo.services?.forEach((service: any, idx: number) => {
              console.log(`      Service ${idx + 1}: ${service.uuid}`);
              if (service.characteristics) {
                console.log(`        Characteristics: ${service.characteristics.length}`);
              }
            });
          }
          
          // Start monitoring for data
          console.log('   Starting data monitoring...');
          this.startMonitoring();
          console.log('   ✅✅✅ Started monitoring data from paired device!');
          console.log('   📡 Waiting for brain wave data...');
          
          return [brainLinkDevice];
        } catch (error: any) {
          console.error('   ❌ Error setting up paired device:');
          console.error('      Error:', error?.message || error);
          console.error('      This might mean:');
          console.error('      1. Device is connected to another app');
          console.error('      2. Device needs to be re-paired');
          console.error('      3. Services are not accessible');
          this.device = null;
          return [];
        }
      }

      console.log('   ℹ️ No BrainLink devices found in paired/connected devices');
      return [];
    } catch (error: any) {
      console.error('❌ Error checking paired devices:');
      console.error('   Error:', error?.message || error);
      console.error('   Stack:', error?.stack);
      return [];
    }
  }

  /**
   * Get current device
   */
  getCurrentDevice(): any {
    return this.device;
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<any> {
    if (!this.device || !this.ensureManager()) {
      return null;
    }

    try {
      const services = await this.device.services();
      const deviceInfo = {
        id: this.device.id,
        name: this.device.name,
        rssi: this.device.rssi,
        isConnectable: this.device.isConnectable,
        services: services.map((service: any) => ({
          uuid: service.uuid,
          isPrimary: service.isPrimary,
        })),
      };

      // Get characteristics for each service
      for (const service of services) {
        try {
          const characteristics = await service.characteristics();
          deviceInfo.services = deviceInfo.services.map((s: any) => {
            if (s.uuid === service.uuid) {
              return {
                ...s,
                characteristics: characteristics.map((char: any) => ({
                  uuid: char.uuid,
                  properties: char.properties,
                  isReadable: char.isReadable,
                  isWritableWithResponse: char.isWritableWithResponse,
                  isWritableWithoutResponse: char.isWritableWithoutResponse,
                  isNotifiable: char.isNotifiable,
                  isIndicatable: char.isIndicatable,
                })),
              };
            }
            return s;
          });
        } catch (error) {
          console.error(`Error reading characteristics for service ${service.uuid}:`, error);
        }
      }

      return deviceInfo;
    } catch (error: any) {
      console.error('Error getting device info:', error?.message || error);
      return null;
    }
  }

  /**
   * Read raw data from characteristic
   */
  async readData(): Promise<string | null> {
    if (!this.device || !this.characteristic || !this.ensureManager()) {
      return null;
    }

    try {
      const characteristic = await this.device.readCharacteristicForService(
        this.SERVICE_UUID,
        this.CHARACTERISTIC_UUID
      );
      return characteristic.value || null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }
}

// Export singleton instance
export const brainLinkService = new BrainLinkService();

