# TurboModule/PlatformConstants Error Fix

## Issue
The error `TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found` occurs because `expo-constants` tries to access native modules before they're ready in Expo SDK 54 with React Native 0.76.

## Solution Applied

1. **Removed expo-constants dependency from Firebase config**
   - Firebase config now uses hardcoded values instead of reading from `expo-constants`
   - This prevents the PlatformConstants error during module initialization

2. **Direct Firebase initialization**
   - Firebase is initialized synchronously without waiting for native modules
   - No dependency on expo-constants at module load time

## Next Steps

1. **Clear cache and restart:**
   ```bash
   npx expo start -c
   ```

2. **If error persists, try:**
   ```bash
   rm -rf node_modules
   rm -rf .expo
   npm install
   npx expo start -c
   ```

3. **Verify Expo Go version:**
   - Make sure your Expo Go app is version 54
   - Update from App Store/Play Store if needed

## Alternative: Use expo-constants lazily

If you need to read from app.json config later, you can do it in a component after the app loads:

```typescript
import Constants from 'expo-constants';

// Use in a useEffect or after component mounts
useEffect(() => {
  const config = Constants.expoConfig?.extra?.firebase;
  // Use config if needed
}, []);
```

The Firebase config is now hardcoded to avoid the initialization error.

