import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WorkerDashboardScreen } from '../screens/worker/WorkerDashboardScreen';
import { TaskDetailScreen } from '../screens/worker/TaskDetailScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { WorkerMapScreen } from '../screens/worker/WorkerMapScreen';

import type { WorkerStackParamList as SharedWorkerStackParamList } from '../types';

export type WorkerStackParamList = SharedWorkerStackParamList;

const Stack = createStackNavigator<SharedWorkerStackParamList>();

export const WorkerNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={WorkerDashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="WorkerMap"
        component={WorkerMapScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

