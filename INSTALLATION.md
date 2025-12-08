# Installation & Setup Instructions

Complete setup guide for the BrainLink Neurofeedback application.

## System Requirements

### Development Machine
- **OS**: macOS, Windows, or Linux
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn v1.22.0+)
- **Git**: Latest version

### Testing Devices
- **iOS**: iPhone or iPad running iOS 13.4 or higher (iPad recommended for landscape)
- **Android**: Tablet running Android 6.0 or higher
- **BrainLink**: BrainLink headset with Bluetooth connectivity

## Step-by-Step Installation

### 1. Install Node.js and npm

**macOS** (using Homebrew):
```bash
brew install node
```

**Windows**:
Download from [nodejs.org](https://nodejs.org/)

**Linux** (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

### 2. Install Expo CLI

```bash
npm install -g expo-cli
```

Verify:
```bash
expo --version
```

### 3. Install EAS CLI (for builds)

```bash
npm install -g eas-cli
```

### 4. Clone or Setup Project

If you have the project repository:
```bash
git clone <repository-url>
cd brainlink/app
```

Or if starting fresh, your files are already in the `app/` directory.

### 5. Install Project Dependencies

```bash
cd app
npm install
```

This will install all dependencies listed in `package.json`:
- React Native and Expo core packages
- BLE (Bluetooth Low Energy) library
- Navigation libraries
- UI components
- And more...

**Troubleshooting**: If you encounter errors:
```bash
npm install --legacy-peer-deps
```

### 6. Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your specific configuration:
```env
BRAINLINK_DEVICE_NAME=BrainLink
BRAINLINK_SERVICE_UUID=0000fff0-0000-1000-8000-00805f9b34fb
BRAINLINK_CHARACTERISTIC_UUID=0000fff1-0000-1000-8000-00805f9b34fb
API_BASE_URL=https://api.yourcompany.com
```

### 7. Add Required Assets

Create the `assets/` directory structure:

```
assets/
├── icon.png
├── adaptive-icon.png
├── splash.png
├── favicon.png
└── games/
    ├── focus-racer.png
    ├── mindful-maze.png
    ├── concentration-catch.png
    ├── brain-balance.png
    ├── focus-flight.png
    └── zen-garden.png
```

#### Quick Asset Generation

For rapid prototyping, create placeholder assets:

**Using ImageMagick** (install via `brew install imagemagick`):
```bash
# Create icon
convert -size 1024x1024 xc:#4CAF50 -pointsize 200 -fill white \
  -gravity center -annotate +0+0 "BL" assets/icon.png

# Create adaptive icon
cp assets/icon.png assets/adaptive-icon.png

# Create splash screen
convert -size 1284x2778 xc:#1a1a2e -pointsize 100 -fill white \
  -gravity center -annotate +0+0 "BrainLink" assets/splash.png

# Create favicon
convert assets/icon.png -resize 48x48 assets/favicon.png

# Create game placeholders
mkdir -p assets/games
for game in focus-racer mindful-maze concentration-catch brain-balance focus-flight zen-garden; do
  convert -size 560x400 xc:#2a2a3e -pointsize 40 -fill white \
    -gravity center -annotate +0+0 "${game}" "assets/games/${game}.png"
done
```

Or use online tools:
- **Icon Generator**: https://makeappicon.com
- **Splash Generator**: https://www.appicon.co
- **Stock Photos**: https://unsplash.com (for game images)

### 8. Configure iOS Simulator (macOS only)

Install Xcode from the App Store, then:
```bash
xcode-select --install
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### 9. Configure Android Emulator

1. Download [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → More Actions → Virtual Device Manager
3. Create a new virtual device (choose a tablet like Pixel Tablet)
4. Download system image (Android 11+ recommended)
5. Start the emulator

### 10. Start Development Server

```bash
npm start
```

Or with cache clearing:
```bash
npm start -- --clear
```

You should see a QR code and development menu.

### 11. Run on Simulator/Emulator

**iOS Simulator**:
```bash
npm run ios
```

**Android Emulator**:
```bash
npm run android
```

**Physical Device**:
1. Install "Expo Go" app from App Store/Play Store
2. Scan QR code from terminal
3. App will load on device

## Platform-Specific Setup

### iOS Development

#### For Development (Simulator):
No additional setup needed if you have Xcode.

#### For Physical Device Testing:
1. Create Apple Developer account (free tier works for testing)
2. Configure signing in Xcode
3. Enable Developer Mode on device:
   - Settings → Privacy & Security → Developer Mode → On

#### For Distribution:
1. Paid Apple Developer account ($99/year)
2. Configure EAS Build:
   ```bash
   eas build:configure
   ```

### Android Development

#### For Emulator:
Already covered in step 9.

#### For Physical Device Testing:
1. Enable Developer Options:
   - Settings → About → Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect via USB and run:
   ```bash
   adb devices  # Verify device is connected
   npm run android
   ```

#### For Distribution:
1. Create keystore:
   ```bash
   keytool -genkeypair -v -keystore brainlink.keystore \
     -alias brainlink -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Configure EAS Build (see below)

## EAS Build Setup (for Production)

### 1. Create Expo Account

```bash
npx expo login
```

Or create account at https://expo.dev

### 2. Initialize EAS

```bash
eas build:configure
```

This creates `eas.json` (already included in project).

### 3. Build for iOS

```bash
eas build --platform ios --profile production
```

### 4. Build for Android

```bash
eas build --platform android --profile production
```

## Bluetooth Setup

### iOS
Bluetooth permissions are configured in `app.json`. No additional steps needed.

### Android
The app requests permissions at runtime. Ensure these are enabled:
- Bluetooth
- Bluetooth Admin
- Location (required for BLE scanning on Android)

To manually grant in emulator:
```bash
adb shell pm grant com.brainlink.neurofeedback android.permission.BLUETOOTH_SCAN
adb shell pm grant com.brainlink.neurofeedback android.permission.BLUETOOTH_CONNECT
adb shell pm grant com.brainlink.neurofeedback android.permission.ACCESS_FINE_LOCATION
```

## Testing BrainLink Connection

### Without Physical Device
The app includes mock data simulation for testing without a BrainLink headset. Random brain wave data updates every 2 seconds.

### With BrainLink Device
1. Charge BrainLink headset fully
2. Turn on headset (LED should blink)
3. Enable Bluetooth on tablet
4. Open app and tap connection icon (⚡)
5. Tap "Scan for Devices"
6. Select your BrainLink device from list
7. Wait for connection (LED becomes solid)
8. Real brain wave data should now display

### Troubleshooting BrainLink
- **Not found in scan**: Check headset is on and charged
- **Connection fails**: Restart both headset and app
- **No data**: Verify UUIDs in `.env` match your device model
- **Android location error**: Grant location permission in settings

## Updating Dependencies

To update all packages:
```bash
npx expo install --fix
npm update
```

To update Expo SDK:
```bash
npx expo upgrade
```

## Common Issues & Solutions

### Metro Bundler Won't Start
```bash
npx expo start --clear
```

### Module Not Found Errors
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### iOS Simulator Not Found
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### BLE Permissions Denied
Uninstall app and reinstall to trigger permission prompts again.

## Next Steps

After installation:
1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for usage guide
2. ✅ Read [README.md](README.md) for feature documentation
3. ✅ Test authentication flow
4. ✅ Test BrainLink connection
5. ✅ Customize game assets
6. ✅ Configure your API endpoints
7. ✅ Build for production

## Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **BLE Library**: https://github.com/dotintent/react-native-ble-plx
- **Expo Forums**: https://forums.expo.dev
- **Stack Overflow**: Tag with `react-native`, `expo`, `ble`

## Development Tools

Recommended tools for development:

- **VS Code**: Code editor with React Native extensions
- **React Native Debugger**: Standalone debugging app
- **Flipper**: Mobile debugging platform
- **Expo DevTools**: Built-in debugging tools

Install VS Code extensions:
```bash
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

---

You're all set! Start developing with `npm start` 🚀

