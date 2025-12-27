# BrainLink Neurofeedback - Build Instructions

Complete guide for building and installing the BrainLink Neurofeedback application.

## 📋 Prerequisites

- Node.js (v18+)
- Android Studio
- Android SDK
- ADB (Android Debug Bridge)
- Physical Android device with USB debugging enabled

## 🚀 Quick Start

### Option 1: Build and Install (Recommended)
```bash
./build-and-install.sh
```
This script will:
1. Clean previous builds
2. Build release APK
3. Install on connected device

### Option 2: Step by Step

#### Build APK
```bash
./build-android.sh
```
Output: `app-release.apk`

#### Install on Device
```bash
./install-android.sh
```

## 📊 View Logs

### Quick View (Real-time)
To see real-time BrainLink data and app logs:
```bash
./view-logs.sh
```

### Capture & Save Logs (macOS)
To capture logs to a file for detailed analysis:
```bash
./capture-logs-macos.sh
```

This will:
- Clear old logs
- Show live filtered logs
- Save complete logs to `/tmp/brainlink-neurofeedback-TIMESTAMP.log`
- Provide analysis commands after stopping

Press `Ctrl+C` to stop viewing/capturing logs.

## 🧠 BrainLink Integration

### Extracted from `example-blutooth`

The following files contain the working BrainLink integration:

#### Core Files:
- `hooks/useBrainLink.ts` - Main BrainLink hook with:
  - BLE connection management
  - ThinkGear protocol parsing
  - Real-time data extraction
  
- `components/EEGGraph.tsx` - Professional EEG visualization
  - Medical-grade graph using d3-shape
  - SVG-based rendering
  - Real-time waveform display

#### Features Available:
- ✅ **Attention** (0-100)
- ✅ **Meditation** (0-100)
- ✅ **Heart Rate** (BPM)
- ✅ **Signal Quality** (0-200)
- ✅ **Brain Waves** (8 frequency bands)
  - Delta, Theta, Low/High Alpha, Low/High Beta, Low/Mid Gamma
- ✅ **Raw EEG Signal** (real-time)
- ✅ **Medical-grade EEG Graph**

## 📱 App Structure

```
app/
├── android/              # Android native code
├── app/                  # Expo Router screens
│   ├── login.tsx        # Login screen
│   ├── signup.tsx       # Registration
│   ├── welcome.tsx      # Welcome screen
│   ├── mini-games.tsx   # Games listing
│   ├── game-detail.tsx  # Game details
│   └── neurofeedback.tsx # BrainLink monitoring
├── components/          # Reusable components
│   ├── BrainLinkConnection.tsx
│   ├── BrainWaveDisplay.tsx
│   ├── EEGGraph.tsx    # Medical-grade graph
│   └── ...
├── hooks/              # Custom hooks
│   └── useBrainLink.ts # BrainLink integration
├── services/           # Business logic
│   └── BrainLinkService.ts
└── types/              # TypeScript types
```

## 🔧 Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
./build-android.sh
```

## 📦 Dependencies

### BrainLink Specific:
- `react-native-ble-plx` - Bluetooth Low Energy
- `react-native-svg` - SVG rendering
- `d3-shape` - Medical-grade graph curves

### Main Stack:
- `expo` - Development platform
- `expo-router` - File-based routing
- `react-native` - Mobile framework

## 🐛 Troubleshooting

### Build Fails
```bash
cd android
./gradlew clean
cd ..
./build-android.sh
```

### Device Not Found
```bash
adb devices
# Reconnect USB cable if needed
# Enable USB debugging on device
```

### Permission Issues
```bash
chmod +x *.sh
```

## 📊 BrainLink Data Flow

```
BrainLink Device
    ↓
BLE Connection (react-native-ble-plx)
    ↓
ThinkGear Protocol Parser (useBrainLink.ts)
    ↓
State Management (React hooks)
    ↓
UI Components (EEGGraph, BrainWaveDisplay, etc.)
    ↓
User Interface
```

## 🎯 Usage Example

```typescript
import { useBrainLink } from './hooks/useBrainLink';

function MyComponent() {
  const {
    isConnected,
    attention,
    meditation,
    heartRate,
    signal,
    delta, theta, lowAlpha, highAlpha,
    rawEEG,
    startScan,
    connectToDevice,
    disconnect
  } = useBrainLink();

  // Use BrainLink data in your component
  return (
    <View>
      <Text>Attention: {attention}</Text>
      <EEGGraph data={rawEEG} />
    </View>
  );
}
```

## 🏥 Medical-Grade Features

The EEG graph uses industry-standard visualization:
- d3-shape curve interpolation (`curveMonotoneX`)
- SVG path rendering
- Reference grid lines
- Real-time waveform display
- Professional medical styling

## 📝 Notes

- Keep existing app structure (login/register/games)
- BrainLink integration is modular and non-intrusive
- All scripts are idempotent (safe to run multiple times)
- Logs are filtered for relevant BrainLink data

## 🚀 Production Build

1. Build APK: `./build-android.sh`
2. Test on device: `./install-android.sh`
3. View logs: `./view-logs.sh`
4. Deploy: Upload `app-release.apk`

---

**Ready to build!** 🎉

Run `./build-and-install.sh` to get started.

