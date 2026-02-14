import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { BinsScreen } from '../screens/admin/BinsScreen';
import { RoutesScreen } from '../screens/admin/RoutesScreen';
import { ReportsScreen } from '../screens/admin/ReportsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { MapScreen } from '../screens/citizen/MapScreen';
import { BinQRCodeAssignmentScreen } from '../screens/admin/BinQRCodeAssignmentScreen';
import { theme } from '../utils/theme';

export type AdminStackParamList = {
  MainTabs: undefined;
  Bins: undefined;
  Routes: undefined;
  Profile: undefined;
  BinQRCodeAssignment: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Map: undefined;
  Reports: undefined;
  Analytics: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createStackNavigator<AdminStackParamList>();

const AdminTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 16,
          left: 16,
          right: 16,
          backgroundColor: theme.colors.surface + 'F5', // 95% opacity
          borderRadius: theme.borderRadius.xl,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.lg,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "view-dashboard" : "view-dashboard-variant"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.secondary }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "map-marker" : "map-marker-outline"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.secondary }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "file-document" : "file-document-outline"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.secondary }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "chart-bar" : "chart-line"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.secondary }]} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "cog" : "cog-outline"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.colors.secondary }]} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTintColor: '#1A1A1A',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Bins"
        component={BinsScreen}
        options={{
          headerShown: true,
          title: 'Bin Management',
          headerStyle: {
            backgroundColor: 'rgba(240, 249, 241, 0.3)',
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Stack.Screen
        name="Routes"
        component={RoutesScreen}
        options={{
          headerShown: true,
          title: 'Routes',
          headerStyle: {
            backgroundColor: 'rgba(240, 249, 241, 0.3)',
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Stack.Screen
        name="BinQRCodeAssignment"
        component={BinQRCodeAssignmentScreen}
        options={{
          headerShown: true,
          title: 'Bin QR Codes',
          headerStyle: {
            backgroundColor: 'rgba(240, 249, 241, 0.3)',
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: 'Profile',
          headerStyle: {
            backgroundColor: 'rgba(240, 249, 241, 0.3)',
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
