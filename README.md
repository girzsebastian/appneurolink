# BrainLink Neurofeedback App

A React Native Expo application for tablets designed for neurofeedback training using the BrainLink headset.

## Features

- 🧠 **BrainLink Integration**: Connects to BrainLink headset via Bluetooth to read brain wave data
- 📊 **Real-time Monitoring**: Display Delta, Theta, Alpha, Beta, and Gamma waves
- 🎯 **Attention Training**: Track attention levels (0-100) in real-time
- 🧘 **Relaxation Tracking**: Monitor relaxation levels (0-100)
- 🎮 **MiniGames**: Interactive games controlled by attention levels
- 📱 **Tablet Optimized**: Configured specifically for landscape view
- 🔄 **Auto Updates**: Automatic update detection and installation

## Tech Stack

- React Native with Expo SDK 51
- TypeScript
- Expo Router for navigation
- React Native BLE PLX for Bluetooth connectivity
- Expo Updates for OTA updates

## Directory Structure

```
app/
├── app/              # Application screens (expo-router)
│   ├── index.tsx     # Loading screen with update check
│   ├── welcome.tsx   # Welcome screen with login/signup
│   ├── login.tsx     # Login screen
│   ├── signup.tsx    # Sign up screen
│   ├── neurofeedback.tsx  # Main dashboard
│   ├── game-options.tsx   # Game selection
│   ├── mini-games.tsx     # MiniGames list
│   └── game-detail.tsx    # Game configuration
├── components/       # Reusable components
│   ├── BottomBar.tsx        # Collapsible data display
│   ├── BrainWaveDisplay.tsx # Brain wave visualization
│   ├── CircularProgress.tsx # Circular progress indicator
│   ├── CustomButton.tsx     # Styled button
│   ├── CustomInput.tsx      # Styled input field
│   └── GameCard.tsx         # Game card component
├── services/         # Business logic services
│   ├── BrainLinkService.ts  # BLE connection & data parsing
│   └── UpdateService.ts     # App update management
├── types/            # TypeScript type definitions
│   └── index.ts
├── assets/           # Images and static files
├── app.json          # Expo configuration
├── package.json      # Dependencies
└── tsconfig.json     # TypeScript configuration
```

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment** (optional):
Edit `.env` file if needed for custom BrainLink configurations.

3. **Start the development server**:
```bash
npm start
```

4. **Run on device**:
- For iOS: `npm run ios`
- For Android: `npm run android`

## BrainLink Setup

### Permissions

The app requires Bluetooth permissions to connect to the BrainLink headset:

**iOS**: 
- `NSBluetoothAlwaysUsageDescription` - Configured in app.json

**Android**:
- `BLUETOOTH`
- `BLUETOOTH_ADMIN`
- `BLUETOOTH_CONNECT`
- `BLUETOOTH_SCAN`
- `ACCESS_FINE_LOCATION`

### Connection Process

1. Turn on your BrainLink headset
2. Open the app
3. The app will automatically scan for nearby BrainLink devices
4. Select your device to connect
5. Once connected, brain wave data will be displayed in real-time

## Brain Wave Data

The BrainLink headset provides the following data:

- **Delta** (0.5-4 Hz): Deep sleep, healing
- **Theta** (4-8 Hz): Meditation, creativity
- **Lo Alpha** (8-10 Hz): Relaxation, calmness
- **Hi Alpha** (10-12 Hz): Alert relaxation
- **Lo Beta** (12-20 Hz): Active thinking, focus
- **Hi Beta** (20-30 Hz): High alertness, anxiety
- **Lo Gamma** (30-40 Hz): Peak performance
- **Hi Gamma** (40-100 Hz): Heightened perception

### Mental State Calculations

- **Attention (0-100)**: Derived primarily from Beta waves
- **Relaxation (0-100)**: Derived primarily from Alpha waves

## App Updates

The app is configured with Expo Updates for over-the-air updates:

1. On app launch, it checks for available updates
2. If an update is available, it downloads automatically
3. User is notified when update is ready
4. App reloads with new version

Configure update settings in `app.json`:
```json
"updates": {
  "enabled": true,
  "checkAutomatically": "ON_LOAD",
  "fallbackToCacheTimeout": 0
}
```

## User Flow

1. **Loading Screen**: Checks for updates, shows loading animation
2. **Welcome Screen**: Choose between Login or Sign Up
3. **Authentication**: Login or create new account
4. **Neurofeedback Dashboard**: Main screen with Attention card
5. **Game Options**: Choose between MiniGames or Video (coming soon)
6. **MiniGames**: Horizontal scrollable list of games
7. **Game Detail**: Configure threshold and dynamic settings
8. **Bottom Bar**: Collapsible view showing brain waves and mental state

## Configuration

### Landscape Orientation

The app is locked to landscape mode in `app.json`:
```json
"orientation": "landscape"
```

### Theme Colors

- Background: `#1a1a2e`
- Secondary: `#2a2a3e`
- Primary: `#4CAF50`
- Accent: `#FF6B6B`, `#4ECDC4`

## Development Notes

### Missing Assets

You'll need to add the following image assets:

- `assets/icon.png` (1024x1024) - App icon
- `assets/splash.png` (1284x2778) - Splash screen
- `assets/adaptive-icon.png` (1024x1024) - Android adaptive icon
- `assets/favicon.png` (48x48) - Web favicon
- `assets/game-placeholder.png` - Game card images

### BrainLink Protocol

The BrainLinkService includes a simplified parser for BrainLink data. You may need to adjust the parsing logic based on your specific BrainLink device model and firmware version.

### Testing Without Device

For testing without a physical BrainLink device, the neurofeedback screen includes simulated data that updates every 2 seconds.

## Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## Troubleshooting

### Bluetooth Connection Issues

1. Ensure Bluetooth is enabled on the device
2. Check that location permissions are granted (Android)
3. Make sure the BrainLink headset is charged and in pairing mode
4. Try restarting both the app and the headset

### Update Issues

If updates fail to download:
1. Check internet connection
2. Clear app cache
3. Reinstall the app

## Future Enhancements

- [ ] Video training mode
- [ ] Session history and analytics
- [ ] Custom game creation
- [ ] Multi-user support
- [ ] Cloud synchronization
- [ ] Advanced data visualization
- [ ] Training programs and goals

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact your system administrator.

