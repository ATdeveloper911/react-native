import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NotificationData } from '../types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'smartwastemanagement-c7500',
    });
    const token = tokenData.data;
    console.log('Expo Push Token:', token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      await Notifications.setNotificationChannelAsync('bin-alerts', {
        name: 'Bin Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      await Notifications.setNotificationChannelAsync('tasks', {
        name: 'Task Notifications',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  },

  async scheduleNotification(notification: NotificationData, trigger?: Notifications.NotificationTriggerInput) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: true,
      },
      trigger: trigger || null,
    });
  },

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};

