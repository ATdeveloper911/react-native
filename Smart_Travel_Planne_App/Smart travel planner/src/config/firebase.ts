// Firebase initialization for React Native/Expo
// Properly initialize Auth with AsyncStorage persistence after React Native is ready

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Auth } from 'firebase/auth';

// Direct config values - avoid expo-constants to prevent PlatformConstants error
const firebaseConfig = {
  apiKey: 'AIzaSyB82EcwoEjS97xLerlTsT9ujLpTHtdn26U',
  authDomain: 'smartwastemanagement-c7500.firebaseapp.com',
  databaseURL: 'https://smartwastemanagement-c7500-default-rtdb.firebaseio.com',
  projectId: 'smartwastemanagement-c7500',
  storageBucket: 'smartwastemanagement-c7500.firebasestorage.app',
  messagingSenderId: '154980746966',
  appId: '1:154980746966:android:660b66d1e569fa33752b77',
};

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Database and Storage immediately (these don't require native modules)
const database: Database = getDatabase(app);
const storage: FirebaseStorage = getStorage(app);

// Auth will be initialized lazily after React Native is fully ready
let _auth: Auth | null = null;
let _authPromise: Promise<Auth> | null = null;
let _isInitializing = false;

// Helper function to check if we're in Expo Go (which has limitations with Firebase Auth)
const isExpoGo = () => {
  try {
    return typeof (globalThis as any).expo !== 'undefined' && (globalThis as any).expo?.Constants?.executionEnvironment === 'storeClient';
  } catch {
    return false;
  }
};

// Helper function to wait for React Native bridge to be ready
const waitForBridge = async (maxWait = 15000): Promise<boolean> => {
  const startTime = Date.now();
  let lastCheck = 0;
  
  while (Date.now() - startTime < maxWait) {
    try {
      // Check if React Native bridge is available
      const g = globalThis as any;
      const hasBridge = !!(g.nativeCallSyncHook || 
                          g.__fbBatchedBridge || 
                          (typeof require !== 'undefined' && require('react-native')));
      
      if (hasBridge) {
        const elapsed = Date.now() - startTime;
        if (Date.now() - lastCheck > 2000) {
          console.log(`React Native bridge detected after ${elapsed}ms`);
          lastCheck = Date.now();
        }
        return true;
      }
    } catch (error) {
      // Ignore errors during bridge check
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.warn('React Native bridge check timeout');
  return false;
};

export const getAuthInstance = async (): Promise<Auth> => {
  // Return existing auth if available
  if (_auth) {
    return _auth;
  }

  // If already initializing, return the existing promise
  if (_authPromise) {
    return _authPromise;
  }

  // Prevent multiple simultaneous initializations
  if (_isInitializing) {
    // Wait for the ongoing initialization
    return new Promise((resolve) => {
      const checkAuth = setInterval(() => {
        if (_auth) {
          clearInterval(checkAuth);
          resolve(_auth);
        }
      }, 100);
    });
  }

  _isInitializing = true;

  // Create a promise that will initialize auth
  _authPromise = new Promise((resolve, reject) => {
    const tryInit = async (attempt = 0) => {
      try {
        if (attempt === 0) {
          console.log('Attempting Firebase Auth initialization...');
        } else {
          // Subsequent attempts: wait with exponential backoff
          const delay = Math.min(2000 * (attempt), 8000);
          console.log(`Retrying auth initialization (attempt ${attempt + 1}) after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Dynamic import to avoid loading at module level
        const { getAuth } = await import('firebase/auth');

        // Try getAuth - this should work once native modules are ready
        try {
          _auth = getAuth(app);
          
          // Verify auth is actually working by checking if it has the expected properties
          if (_auth && typeof (_auth as any).currentUser !== 'undefined') {
            console.log('✅ Auth initialized successfully using getAuth');
            _isInitializing = false;
            resolve(_auth);
            return;
          } else {
            throw new Error('Auth instance is invalid');
          }
        } catch (getAuthError: any) {
          // Check if it's the "not registered" error
          const isNotRegisteredError = 
            getAuthError.message?.includes('not been registered') || 
            getAuthError.message?.includes('has not been registered') ||
            getAuthError.message?.includes('Component auth has not been registered');
          
          if (isNotRegisteredError) {
            // Only block on bridge readiness when we *know* the module isn't registered yet.
            if (attempt === 0) {
              console.log('Auth not registered yet; waiting briefly for React Native bridge...');
              await waitForBridge(5000);
            }
            if (attempt < 12) {
              // Continue retrying - native modules might still be loading
              // Use longer delays for later attempts
              setTimeout(() => tryInit(attempt + 1), 0);
              return;
            } else {
              // After many retries, check if we're in Expo Go
              if (isExpoGo()) {
                _isInitializing = false;
                reject(new Error('Firebase Auth requires a development build. Expo Go does not support Firebase Auth native modules. Please build the app using EAS Build or create a development build.'));
                return;
              }
              
              // Try initializeAuth as absolute last resort
              console.warn('getAuth failed after many retries, trying initializeAuth as last resort...');
              try {
                const { initializeAuth } = await import('firebase/auth');
                const authModule: any = await import('firebase/auth');
                const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;

                const getReactNativePersistence = authModule.getReactNativePersistence;
                if (typeof getReactNativePersistence !== 'function') {
                  throw new Error('getReactNativePersistence is not available in this Firebase Auth build');
                }

                _auth = initializeAuth(app, {
                  persistence: getReactNativePersistence(AsyncStorage),
                });
                console.log('✅ Auth initialized using initializeAuth (last resort)');
                _isInitializing = false;
                resolve(_auth);
                return;
              } catch (initError: any) {
                // If already initialized, get existing instance
                if (initError.code === 'auth/already-initialized' || 
                    initError.message?.includes('already-initialized')) {
                  _auth = getAuth(app);
                  _isInitializing = false;
                  resolve(_auth);
                  return;
                }
                
                _isInitializing = false;
                reject(new Error(`Failed to initialize auth after ${attempt + 1} attempts. The app may need to be rebuilt with native modules. Error: ${initError.message}`));
                return;
              }
            }
          } else {
            // Other errors - might be a different issue
            throw getAuthError;
          }
        }
      } catch (error: any) {
        // Final fallback
        if (attempt < 12) {
          const delay = Math.min(2000 * (attempt + 1), 8000);
          setTimeout(() => tryInit(attempt + 1), delay);
        } else {
          _isInitializing = false;
          console.error('All auth initialization attempts failed:', error);
          const errorMsg = isExpoGo() 
            ? 'Firebase Auth requires a development build. Please build the app using EAS Build.'
            : `Failed to initialize auth: ${error.message}. Please restart the app or rebuild with native modules.`;
          reject(new Error(errorMsg));
        }
      }
    };

    // Start initialization immediately
    tryInit();
  });

  return _authPromise;
};

// Export db, storage, and app immediately
export { database, storage, app };
export default app;

// For backward compatibility, export auth getter
export const auth = new Proxy({} as Auth, {
  get: () => {
    throw new Error('Please use getAuthInstance() instead of importing auth directly. Auth must be initialized asynchronously.');
  },
});
