# Next Steps - Getting Your App Running

Your BrainLink Neurofeedback app is now complete! Follow these steps to get it running.

## Immediate Actions (Required)

### 1. Install Dependencies
```bash
cd /Users/girzsebastian/Documents/repositories/brainlink/app
npm install
```

### 2. Create Placeholder Assets

You need to create image files in the `assets/` directory. Quick temporary solutions:

**Option A: Use Simple Colored Squares (Fastest)**
```bash
# Create directories
mkdir -p assets/games

# For macOS with ImageMagick (install: brew install imagemagick)
convert -size 1024x1024 xc:#4CAF50 -gravity center -pointsize 200 -fill white -annotate +0+0 "BL" assets/icon.png
convert -size 1024x1024 xc:#4CAF50 assets/adaptive-icon.png
convert -size 1284x2778 xc:#1a1a2e -gravity center -pointsize 100 -fill white -annotate +0+0 "BrainLink" assets/splash.png
convert -size 48x48 xc:#4CAF50 assets/favicon.png

# Game images
for game in focus-racer mindful-maze concentration-catch brain-balance focus-flight zen-garden; do
  convert -size 560x400 xc:#2a2a3e -gravity center -pointsize 40 -fill white -annotate +0+0 "${game}" "assets/games/${game}.png"
done
```

**Option B: Use Online Generator**
1. Go to https://makeappicon.com
2. Upload any 1024x1024 image
3. Download generated icons
4. Place in `assets/` directory

**Option C: Manual Creation**
Create PNG files with these dimensions:
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `favicon.png` (48x48)
- `games/*.png` (560x400 each)

### 3. Update Game Image References

Edit `app/mini-games.tsx` to reference your actual images:

```typescript
const MINI_GAMES: MiniGame[] = [
  {
    id: '1',
    title: 'Focus Racer',
    image: require('../assets/games/focus-racer.png'), // Change this path
    description: 'Race car controlled by your attention',
  },
  // ... update all 6 games
];
```

### 4. Start Development Server
```bash
npm start
```

Press:
- `i` for iOS simulator (macOS only)
- `a` for Android emulator
- Or scan QR code with Expo Go app

## Testing the App

### Test Flow 1: Authentication (No BrainLink needed)
1. App opens → Loading screen (3 seconds)
2. Welcome screen → Tap "Sign Up"
3. Fill form → Tap "Register User"
4. Redirects to Neurofeedback dashboard
5. See mock brain wave data updating

### Test Flow 2: Navigation
1. From Neurofeedback → Tap "ATTENTION" card
2. Game Options screen → Tap "MiniGames"
3. MiniGames screen → Scroll horizontally through games
4. Tap any game → Game Detail screen
5. Adjust threshold slider (30-100)
6. Toggle "Dynamic" checkbox
7. Tap "START" button

### Test Flow 3: Bottom Bar
1. On Neurofeedback screen
2. Tap "Show Data" at bottom
3. Bar slides up
4. See Attention and Relaxation circles
5. Toggle "Raw EEG" and "Brain Waves" switches
6. See brain wave visualization
7. Tap "Hide Data"

### Test Flow 4: BrainLink Connection (With device)
1. Turn on BrainLink headset
2. On Neurofeedback screen → Tap ⚡ icon (top right)
3. Tap "Scan for Devices"
4. Wait for BrainLink to appear
5. Tap device to connect
6. See "● Connected" badge
7. Real data replaces mock data

## Common First-Run Issues

### Issue: "Unable to resolve module"
**Solution:**
```bash
npx expo install --fix
npm install
```

### Issue: "No bundle URL present"
**Solution:**
```bash
npm start -- --clear
```

### Issue: "Image failed to load" 
**Solution:** Check that all image files exist in `assets/` directory

### Issue: Simulator won't start
**iOS:**
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

**Android:**
Open Android Studio → Tools → AVD Manager → Start emulator manually

### Issue: TypeScript errors
**Solution:**
```bash
npm run tsc --noEmit
```
Fix reported errors or add `// @ts-ignore` above problematic lines temporarily

## Configuration (Optional but Recommended)

### Configure BrainLink Device

If your BrainLink model uses different UUIDs, edit the `.env` file:

```env
BRAINLINK_SERVICE_UUID=your-service-uuid-here
BRAINLINK_CHARACTERISTIC_UUID=your-characteristic-uuid-here
```

Common BrainLink UUIDs:
- **BrainLink Pro**: 0000fff0-0000-1000-8000-00805f9b34fb (service)
- **BrainLink Lite**: Check device documentation

### Test on Real Tablet

The app is optimized for tablets. To test on physical device:

1. **iOS**: 
   - Connect iPad via USB
   - Trust computer
   - `npm run ios` will detect device

2. **Android**:
   - Enable Developer Mode (tap Build Number 7x)
   - Enable USB Debugging
   - Connect via USB
   - `npm run android`

3. **Expo Go** (quickest):
   - Install "Expo Go" from App Store/Play Store
   - Scan QR code from `npm start`

## Customization Ideas

### Change Theme Colors

Edit color constants in components and screens:

```typescript
// Current theme
Primary: '#4CAF50'    // Green
Background: '#1a1a2e' // Dark blue-grey
Secondary: '#2a2a3e'  // Grey

// Update to your brand colors
```

### Add Your Logo

Replace the placeholder logo in:
- Loading screen (`app/index.tsx`)
- Welcome screen (`app/welcome.tsx`)

### Customize Games

The 6 mini-games currently have placeholder logic. To implement:

1. Edit `app/game-detail.tsx`
2. Create actual game screen
3. Use `threshold` and `isDynamic` settings
4. Read `brainWaveData.attention` in real-time
5. Adjust game based on attention level

## Production Build (When Ready)

### iOS TestFlight

```bash
# Login to Expo
npx expo login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Follow instructions to upload to TestFlight
```

### Android Internal Testing

```bash
# Build APK
eas build --platform android --profile production

# Download APK and upload to Play Console
```

## Monitoring & Debugging

### Metro Bundler Logs
Watch the terminal where you ran `npm start` for errors

### Device Logs

**iOS**:
```bash
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "BrainLink"'
```

**Android**:
```bash
adb logcat *:S ReactNative:V ReactNativeJS:V
```

### Common Debug Commands

```bash
# Clear all caches
rm -rf node_modules
npm install
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Check for updates
npx expo-doctor
```

## Getting Help

1. **Check Documentation**: README.md, INSTALLATION.md, QUICKSTART.md
2. **Expo Forums**: https://forums.expo.dev
3. **React Native Docs**: https://reactnative.dev
4. **BLE Issues**: https://github.com/dotintent/react-native-ble-plx/issues

## Recommended Development Flow

1. **Week 1**: Get app running, test all screens, add real assets
2. **Week 2**: Test BrainLink connection, verify data accuracy
3. **Week 3**: Implement game logic, test with real users
4. **Week 4**: Polish UI, fix bugs, prepare for deployment
5. **Week 5**: Submit to app stores

## Quick Reference Commands

```bash
# Start development
npm start

# Run iOS
npm run ios

# Run Android  
npm run android

# Clear cache
npm start -- --clear

# Install dependencies
npm install

# Update Expo
npx expo upgrade

# Build production
eas build --platform all
```

## Success Checklist

Before considering the app "done":

- [ ] App starts without errors
- [ ] All 9 screens load correctly
- [ ] Navigation works between all screens
- [ ] Login/Sign up forms validate properly
- [ ] Bottom bar expands/collapses smoothly
- [ ] Brain wave data displays (mock or real)
- [ ] Circular progress indicators animate
- [ ] All 6 games appear in mini-games list
- [ ] Game detail screen slider works (30-100)
- [ ] BrainLink connection modal opens
- [ ] App works in landscape orientation
- [ ] Real images replace placeholders
- [ ] No TypeScript errors
- [ ] No runtime errors in console

## You're Ready! 🚀

Your app structure is complete. The main work remaining is:

1. **Add images** (30 minutes)
2. **Test flows** (1-2 hours)
3. **Implement game logic** (1-2 weeks)
4. **Polish & test** (1 week)

Start with: `npm install && npm start`

Good luck with your BrainLink Neurofeedback app! 🧠✨

