import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOfflineSync } from './src/hooks/useOfflineSync';
import { notificationService } from './src/services/notificationService';

function AppContent() {
  useOfflineSync();

  useEffect(() => {
    // Register for push notifications with error handling
    notificationService.registerForPushNotifications().catch((error) => {
      console.warn('Failed to register for push notifications:', error);
    });
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <AppContent />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

