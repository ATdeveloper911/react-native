import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { CitizenNavigator } from './CitizenNavigator';
import { WorkerNavigator } from './WorkerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export const AppNavigator: React.FC = () => {
  const { user, userData, loading } = useAuth();
  const [userDataTimeout, setUserDataTimeout] = React.useState(false);

  // Set timeout for userData loading (max 10 seconds)
  React.useEffect(() => {
    if (user && !userData && !loading) {
      const timeout = setTimeout(() => {
        console.warn('UserData loading timeout - user exists but data not loaded');
        setUserDataTimeout(true);
      }, 10000); // 10 second timeout
      return () => clearTimeout(timeout);
    } else {
      setUserDataTimeout(false);
    }
  }, [user, userData, loading]);

  // Show loading while auth is initializing
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If user exists but userData is not loaded yet, show loading (with timeout)
  // This handles the case where user just logged in but userData is still being fetched
  if (user && !userData && !userDataTimeout) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  // If timeout occurred, the fallback mechanism in AuthContext should have created userData
  // But if it still doesn't exist, show auth screen with error message
  if (user && !userData && userDataTimeout) {
    console.error('UserData failed to load after timeout. User ID:', user.uid);
    console.error('This usually indicates:');
    console.error('1. Database permissions issue - check Firebase Realtime Database rules');
    console.error('2. Database path mismatch');
    console.error('3. Network connectivity issue');
    // Show auth screen - user may need to re-login or check database
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {!user && !userData ? (
        <AuthNavigator />
      ) : userData?.role === 'citizen' ? (
        <CitizenNavigator />
      ) : userData?.role === 'worker' ? (
        <WorkerNavigator />
      ) : userData?.role === 'admin' ? (
        <AdminNavigator />
      ) : (
        // If user exists but no userData or invalid role, show auth screen
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
});

