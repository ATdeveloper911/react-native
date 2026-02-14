import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getAuthInstance } from '../config/firebase';
import { authService } from '../services/authService';
import { User, UserRole } from '../types';
import { setBiometricEligible, clearBiometricEligible, getBiometricEligible } from '../utils/biometric';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, zone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  restoreUserFromBiometric: (userId: string, userRole: UserRole, userEmail: string, userName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const buildFallbackUserData = (firebaseUser: FirebaseUser, role: UserRole = 'citizen'): User => {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      role,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      createdAt: Date.now(),
      isActive: true,
    };
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    const initAuth = async () => {
      try {
        const auth = await getAuthInstance();
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) return;
          
          console.log('Auth state changed:', firebaseUser ? firebaseUser.uid : 'null');
          setUser(firebaseUser);
          
          if (firebaseUser) {
            // Instant navigation path: if we have cached biometric info, use it as minimal userData
            // so AppNavigator can route immediately (worker/admin/citizen) while DB fetch continues.
            try {
              const cached = await getBiometricEligible();
              if (cached.userId === firebaseUser.uid && cached.userRole && cached.userEmail) {
                const minimalCached: User = {
                  id: firebaseUser.uid,
                  email: cached.userEmail,
                  role: cached.userRole,
                  name: cached.userName || firebaseUser.displayName || cached.userEmail.split('@')[0] || 'User',
                  createdAt: Date.now(),
                  isActive: true,
                };
                if (isMounted) {
                  setUserData(minimalCached);
                  setLoading(false);
                }
              }
            } catch {
              // ignore cache read errors
            }

            try {
              console.log('Fetching user data for:', firebaseUser.uid);
              // Fast-path: single attempt so we don't block navigation on slow networks.
              let data = await authService.getUserData(firebaseUser.uid, 1);
              
              // If userData not found, create a fallback from Firebase user
              if (!data) {
                console.warn('User data not found in database. Creating fallback userData from Firebase user.');
                data = buildFallbackUserData(firebaseUser, 'citizen');
                
                // Try to save this to database (might fail due to permissions, but that's okay)
                try {
                  await authService.saveUserData(firebaseUser.uid, data);
                  console.log('Fallback userData saved to database');
                } catch (saveError) {
                  console.warn('Could not save fallback userData to database:', saveError);
                  // Continue anyway - user can still use the app
                }
              }
              
              console.log('User data fetched:', data ? `Role: ${data.role}` : 'null');
              if (isMounted) {
                setUserData(data);
                setLoading(false);
              }

              // Background refresh: try to load full data with retries without blocking UI.
              authService.getUserData(firebaseUser.uid)
                .then((fresh) => {
                  if (fresh && isMounted) setUserData(fresh);
                })
                .catch(() => {});
            } catch (error: any) {
              console.error('Failed to get user data:', error);
              if (isMounted) {
                // If it's a permission error, create fallback userData
                if (error.message?.includes('Permission denied')) {
                  console.error('⚠️ Database permission error. Creating fallback userData.');
                  const fallbackData: User = buildFallbackUserData(firebaseUser, 'citizen');
                  setUserData(fallbackData);
                } else {
                  setUserData(null);
                }
                setLoading(false);
              }
            }
          } else {
            if (isMounted) {
              setUserData(null);
              setLoading(false);
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt for:', email);
      const firebaseUser = await authService.login(email, password);
      console.log('Login successful, user ID:', firebaseUser.uid);
      
      // Set user immediately
      setUser(firebaseUser);
      
      // Immediately fetch user data after successful login
      // onAuthStateChanged will also fire, but we want to set userData immediately for faster navigation
      if (firebaseUser) {
        try {
          // Fast-path: single attempt for immediate navigation.
          let data = await authService.getUserData(firebaseUser.uid, 1);
          
          // If userData not found, create fallback
          if (!data) {
            console.warn('User data not found after login. Creating fallback userData.');
            data = buildFallbackUserData(firebaseUser, 'citizen');
            
            // Try to save fallback to database
            try {
              await authService.saveUserData(firebaseUser.uid, data);
            } catch (saveError) {
              console.warn('Could not save fallback userData:', saveError);
            }
          }
          
          console.log('User data loaded after login:', data ? `Role: ${data.role}` : 'null');
          if (data) {
            setUserData(data);
            setLoading(false);

            // Background refresh: keep trying to load full data without blocking UI.
            authService.getUserData(firebaseUser.uid)
              .then((fresh) => {
                if (fresh) setUserData(fresh);
              })
              .catch(() => {});
            // Mark user as eligible for biometric authentication and store role/email
            try {
              await setBiometricEligible(
                firebaseUser.uid, 
                data.role, 
                data.email, 
                data.name || firebaseUser.displayName || undefined
              );
            } catch (error) {
              console.warn('Failed to set biometric eligibility:', error);
            }
          } else {
            console.warn('User data not found after login. onAuthStateChanged will retry.');
            // Keep loading true so onAuthStateChanged can handle it
          }
        } catch (error) {
          console.error('Failed to get user data after login:', error);
          // Create fallback userData
          const fallbackData: User = buildFallbackUserData(firebaseUser, 'citizen');
          setUserData(fallbackData);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in authService, just rethrow
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole, zone?: string) => {
    try {
      console.log('Registration attempt for:', email, 'Role:', role);
      const firebaseUser = await authService.register(email, password, name, role, zone);
      console.log('Registration successful, user ID:', firebaseUser.uid);
      
      // Set user immediately (user is automatically signed in after registration)
      setUser(firebaseUser);
      
      // After registration, user is automatically signed in
      // Wait a moment for database write to complete, then fetch user data
      if (firebaseUser) {
        try {
          // Wait for database write to complete (with retries built into getUserData)
          await new Promise(resolve => setTimeout(resolve, 1000));
          const data = await authService.getUserData(firebaseUser.uid);
          console.log('User data loaded after registration:', data ? `Role: ${data.role}` : 'null');
          if (data) {
            setUserData(data);
            setLoading(false);
            // Mark user as eligible for biometric authentication and store role/email
            try {
              await setBiometricEligible(
                firebaseUser.uid,
                data.role,
                data.email,
                data.name || firebaseUser.displayName || undefined
              );
            } catch (error) {
              console.warn('Failed to set biometric eligibility:', error);
            }
          } else {
            console.warn('User data not found after registration. onAuthStateChanged will retry.');
            // Keep loading true so onAuthStateChanged can handle it
          }
        } catch (error) {
          console.error('Failed to get user data after registration:', error);
          // onAuthStateChanged will handle setting userData as fallback
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled in authService, just rethrow
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserData(null);
    // Clear biometric eligibility on logout
    try {
      await clearBiometricEligible();
    } catch (error) {
      console.warn('Failed to clear biometric eligibility:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        const data = await authService.getUserData(user.uid);
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  // Restore user from stored biometric data (for fingerprint navigation)
  const restoreUserFromBiometric = async (userId: string, userRole: UserRole, userEmail: string, userName?: string) => {
    try {
      // Create minimal userData from stored biometric data
      const minimalUserData: User = {
        id: userId,
        email: userEmail,
        role: userRole,
        name: userName || userEmail.split('@')[0] || 'User',
        createdAt: Date.now(),
        isActive: true,
      };
      
      // Try to get Firebase Auth instance to check if session exists
      const auth = await getAuthInstance();
      const currentUser = auth.currentUser;
      
      if (currentUser && currentUser.uid === userId) {
        // Firebase session exists - use it and fetch full user data
        setUser(currentUser);
        setLoading(false);
        try {
          const fullData = await authService.getUserData(userId);
          setUserData(fullData || minimalUserData);
        } catch {
          setUserData(minimalUserData);
        }
      } else {
        // No Firebase session - set minimal user data for navigation
        // This allows AppNavigator to navigate immediately
        setUserData(minimalUserData);
        setLoading(false);
        
        // Immediately try to fetch full user data from database (doesn't require Firebase Auth)
        // This will update userData with profile picture, etc.
        authService.getUserData(userId)
          .then(fullData => {
            if (fullData) {
              console.log('Full user data fetched after biometric:', fullData);
              setUserData(fullData);
            }
          })
          .catch(error => {
            console.warn('Failed to fetch full user data after biometric:', error);
            // Keep minimal userData if fetch fails
          });
        
        // Also try to restore Firebase session in background for full functionality
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser && firebaseUser.uid === userId) {
            unsub();
            setUser(firebaseUser);
            // Fetch full user data again (in case it wasn't fetched above)
            authService.getUserData(userId).then(data => {
              if (data) setUserData(data);
            }).catch(() => {});
          }
        });
        // Cleanup after 5 seconds
        setTimeout(() => {
          try { unsub(); } catch (_) {}
        }, 5000);
      }
    } catch (error) {
      console.error('Failed to restore user from biometric:', error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, register, logout, refreshUserData, restoreUserFromBiometric }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

