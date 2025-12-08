# Quick Start Guide

Get your BrainLink Neurofeedback app up and running in minutes!

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)
- Physical tablet device (for testing BrainLink connection)

## Step 1: Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

## Step 2: Configure Environment (Optional)

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if you need to customize BrainLink UUIDs or API endpoints.

## Step 3: Add Placeholder Assets

Create basic placeholder images in the `assets/` directory:

- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

You can use [makeappicon.com](https://makeappicon.com) to generate these quickly.

For game images, you can temporarily use any 560x400 images named:
- `assets/games/focus-racer.png`
- `assets/games/mindful-maze.png`
- etc.

## Step 4: Start Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

## Step 5: Run on Device/Simulator

### iOS Simulator

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

### Physical Device

1. Install "Expo Go" app from App Store or Play Store
2. Scan the QR code from the terminal or Expo DevTools
3. The app will load on your device

## Testing the App

### Without BrainLink Device

The app includes simulated data for testing without a physical BrainLink headset. The neurofeedback screen will display random brain wave data that updates every 2 seconds.

### With BrainLink Device

1. Turn on your BrainLink headset
2. Enable Bluetooth on your tablet
3. Open the app and navigate to the Neurofeedback screen
4. Tap the Bluetooth icon (you may need to add this button)
5. Scan for devices
6. Select your BrainLink device to connect
7. Start receiving real brain wave data!

## Common Issues

### Module not found errors

```bash
npm install
npx expo install --fix
```

### Bluetooth permissions

Make sure you've granted Bluetooth and Location permissions (Android) in your device settings.

### App not loading

Clear cache and restart:

```bash
npx expo start -c
```

## Project Structure Overview

```
app/
├── app/              # Screens (expo-router)
├── components/       # Reusable UI components
├── services/         # BLE & Update services
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
└── assets/           # Images and static files
```

## Key Features to Test

1. **Authentication Flow**
   - Welcome → Login/Sign Up → Neurofeedback Dashboard

2. **Bottom Bar**
   - Tap "Show Data" to expand
   - Toggle Raw EEG and Brain Waves
   - View Attention and Relaxation circles

3. **Game Selection**
   - Tap ATTENTION card
   - Choose MiniGames
   - Scroll through game cards
   - Select a game

4. **Game Configuration**
   - Adjust threshold slider (30-100)
   - Toggle Dynamic checkbox
   - Press START

## Next Steps

1. **Add Real Assets**: Replace placeholder images with branded designs
2. **Configure BrainLink**: Verify UUIDs match your device model
3. **Test Connection**: Connect to physical BrainLink headset
4. **Customize Games**: Implement actual game logic
5. **Deploy**: Build for production with EAS Build

## Building for Production

### Create Expo Account

```bash
npx expo login
```

### Configure EAS

```bash
eas build:configure
```

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native BLE PLX](https://github.com/dotintent/react-native-ble-plx)

## Support

For issues or questions, check:
1. Console logs in Metro bundler
2. Device logs (iOS: Console.app, Android: adb logcat)
3. Expo forums and Discord

Happy coding! 🧠✨

