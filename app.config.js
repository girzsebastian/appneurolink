// This file allows for dynamic app configuration
// Useful when you need to read environment variables

export default {
  expo: {
    name: process.env.APP_NAME || 'BrainLink Neurofeedback',
    slug: 'brainlink',
    version: process.env.APP_VERSION || '1.0.0',
    orientation: 'landscape',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1a1a2e',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.brainlink.neurofeedback',
      infoPlist: {
        NSBluetoothAlwaysUsageDescription:
          'This app needs Bluetooth access to connect to your BrainLink headset for neurofeedback training.',
        NSBluetoothPeripheralUsageDescription:
          'This app needs Bluetooth access to connect to your BrainLink headset for neurofeedback training.',
        UIRequiresPersistentWiFi: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1a1a2e',
      },
      package: 'com.brainlink.neurofeedback',
      permissions: [
        'BLUETOOTH',
        'BLUETOOTH_ADMIN',
        'BLUETOOTH_CONNECT',
        'BLUETOOTH_SCAN',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router'],
    scheme: 'brainlink',
    updates: {
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 0,
      url: process.env.UPDATES_URL,
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    extra: {
      brainLinkServiceUUID: process.env.BRAINLINK_SERVICE_UUID,
      brainLinkCharacteristicUUID: process.env.BRAINLINK_CHARACTERISTIC_UUID,
      apiBaseUrl: process.env.API_BASE_URL,
      eas: {
        projectId: process.env.EAS_PROJECT_ID || '406f725b-7bb5-4961-983c-744440d0b316',
      },
    },
  },
};

