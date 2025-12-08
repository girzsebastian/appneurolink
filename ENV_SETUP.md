# Environment Configuration Guide

## Environment Files Structure

```
app/
├── .env.example              # Template (committed to git)
├── .env.development          # Development config (committed to git)
├── .env.production           # Production config (committed to git)
├── .env.local.example        # Local template (committed to git)
├── .env                      # Your active config (git-ignored)
└── .env.local                # Your local overrides (git-ignored)
```

## Quick Setup

### Option 1: For Development (Recommended)

Copy development config to .env:
```bash
cp .env.development .env
```

### Option 2: For Production Testing

Copy production config to .env:
```bash
cp .env.production .env
```

### Option 3: Personal Local Settings

If you need personal settings (different BrainLink device, local API, etc.):
```bash
cp .env.local.example .env.local
# Edit .env.local with your settings
```

## Environment Priority

Expo loads environment variables in this order (last wins):

1. `.env.development` or `.env.production` (based on build profile)
2. `.env`
3. `.env.local`

So `.env.local` overrides everything else.

## Accessing Environment Variables

### In JavaScript/TypeScript

Install expo-constants if not already installed:
```bash
npx expo install expo-constants
```

Access variables:
```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiBaseUrl;
const brainLinkUUID = Constants.expoConfig?.extra?.brainLinkServiceUUID;
```

### In app.config.js

Variables are automatically available via `process.env`:
```javascript
export default {
  expo: {
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      brainLinkServiceUUID: process.env.BRAINLINK_SERVICE_UUID,
    }
  }
};
```

## Configuration Differences

### Development (.env.development)
- ✅ Mock data enabled
- ✅ Debug logging enabled
- ✅ Dev menu enabled
- ✅ Points to dev API
- ❌ Updates disabled
- ❌ Analytics disabled

### Production (.env.production)
- ❌ Mock data disabled (use real BrainLink)
- ❌ Debug logging disabled
- ❌ Dev menu disabled
- ✅ Points to production API
- ✅ Updates enabled
- ✅ Analytics enabled
- ✅ Performance monitoring

## Important Variables

### BrainLink Settings
```bash
BRAINLINK_DEVICE_NAME=BrainLink
BRAINLINK_SERVICE_UUID=0000fff0-0000-1000-8000-00805f9b34fb
BRAINLINK_CHARACTERISTIC_UUID=0000fff1-0000-1000-8000-00805f9b34fb
```

**Note**: These UUIDs work for most BrainLink devices. If your device doesn't connect, check your device's documentation for correct UUIDs.

### API Configuration
```bash
API_BASE_URL=https://api.brainlink.com
API_VERSION=v1
API_TIMEOUT=10000
```

### Feature Flags
```bash
ENABLE_MOCK_DATA=true          # Use simulated brain wave data
ENABLE_DEBUG_LOGGING=true      # Console logs for debugging
ENABLE_ANALYTICS=false          # Google Analytics / Firebase
ENABLE_PERFORMANCE_MONITORING=false  # Performance tracking
```

### Expo Updates
```bash
UPDATES_URL=https://u.expo.dev/your-project-id
UPDATES_ENABLED=true
```

Get your updates URL from: https://expo.dev (after creating project)

## Common Scenarios

### Scenario 1: Local Development (No BrainLink device)
```bash
# .env
ENABLE_MOCK_DATA=true
API_BASE_URL=https://dev-api.brainlink.com
ENABLE_DEBUG_LOGGING=true
```

### Scenario 2: Testing with Real BrainLink
```bash
# .env
ENABLE_MOCK_DATA=false
BRAINLINK_SERVICE_UUID=your-device-uuid
ENABLE_DEBUG_LOGGING=true
```

### Scenario 3: Testing Production Build Locally
```bash
# .env
ENABLE_MOCK_DATA=false
API_BASE_URL=https://api.brainlink.com
UPDATES_ENABLED=false  # Don't fetch updates in local test
ENABLE_DEBUG_LOGGING=false
```

### Scenario 4: Building for App Store
```bash
# Use .env.production (no changes needed)
eas build --platform ios --profile production
```

## Troubleshooting

### Variables Not Loading

1. **Restart Metro bundler**:
   ```bash
   npx expo start --clear
   ```

2. **Check app.config.js** is reading variables:
   ```javascript
   console.log('API URL:', process.env.API_BASE_URL);
   ```

3. **Verify file naming** - must start with `.env`

### Wrong Environment Loading

Make sure you're using the right command:
- Development: `npm start` or `npx expo start`
- Production build: `eas build --profile production`

### BrainLink Not Connecting

1. Check UUIDs match your device:
   ```bash
   BRAINLINK_SERVICE_UUID=your-actual-uuid
   ```

2. Enable debug logging:
   ```bash
   ENABLE_DEBUG_LOGGING=true
   ```

3. Check console for connection errors

## Security Notes

### ⚠️ Never Commit
- `.env` (your active config)
- `.env.local` (your personal settings)
- API keys or secrets

These files are in `.gitignore`.

### ✅ Safe to Commit
- `.env.example`
- `.env.development`
- `.env.production`
- `.env.local.example`

Just don't put real secrets in these files!

### For Sensitive Data

Use Expo Secrets (for builds):
```bash
eas secret:create --name API_KEY --value your-secret-key --type string
```

## Using Different Environments

### Development
```bash
# Automatically uses .env.development
npm start
```

### Production Build
```bash
# Uses .env.production
eas build --platform all --profile production
```

### Preview Build
```bash
# Uses .env.production but with preview profile
eas build --platform all --profile preview
```

### Override for Testing
```bash
# Create .env.local with test settings
# It will override other env files
```

## Example Workflow

1. **Day-to-day development**:
   ```bash
   cp .env.development .env
   npm start
   ```

2. **Testing with your BrainLink**:
   ```bash
   # Create .env.local
   echo "BRAINLINK_DEVICE_NAME=MyBrainLink" > .env.local
   echo "ENABLE_MOCK_DATA=false" >> .env.local
   npm start
   ```

3. **Building for production**:
   ```bash
   # Edit .env.production with real API URLs
   eas build --platform all --profile production
   ```

## Quick Commands

```bash
# Setup for first time
cp .env.development .env

# Switch to development
cp .env.development .env && npm start -- --clear

# Switch to production testing
cp .env.production .env && npm start -- --clear

# View current environment
cat .env

# Clear and restart
npx expo start --clear
```

## Reference

- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [Expo Constants](https://docs.expo.dev/versions/latest/sdk/constants/)

---

**Start with**: `cp .env.development .env && npm start` 🚀

