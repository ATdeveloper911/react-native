import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CitizenDashboardScreen } from '../screens/citizen/CitizenDashboardScreen';
import { MapScreen } from '../screens/citizen/MapScreen';
import { ReportScreen } from '../screens/citizen/ReportScreen';
import { LearnScreen } from '../screens/citizen/LearnScreen';
import { ScheduleScreen } from '../screens/citizen/ScheduleScreen';
import { BinScannerScreen } from '../screens/citizen/BinScannerScreen';
import { AlertsScreen } from '../screens/citizen/AlertsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { theme } from '../utils/theme';

export type CitizenTabParamList = {
  Home: undefined;
  Map: undefined;
  Report: undefined;
  Alerts: undefined;
  Profile: undefined;
  Schedule: undefined; // Accessible from dashboard but not in tabs
  Learn: undefined; // Accessible from dashboard but not in tabs
};

export type CitizenStackParamList = {
  MainTabs: undefined;
  Schedule: undefined;
  Learn: undefined;
  BinScanner: undefined;
};

const Tab = createBottomTabNavigator<CitizenTabParamList>();
const Stack = createStackNavigator<CitizenStackParamList>();

type NavigationProp = StackNavigationProp<CitizenStackParamList>;

const CitizenTabs: React.FC = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 16,
          left: 16,
          right: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: theme.borderRadius.xl,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.1)',
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
        name="Home"
        component={CitizenDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "home" : "home-outline"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={styles.activeIndicator} />}
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
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <LinearGradient
              colors={['#4CAF50', '#81C784']}
              style={styles.centerButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconButton 
                icon="plus" 
                size={24} 
                iconColor="#FFFFFF"
                style={{ margin: 0 }}
              />
            </LinearGradient>
          ),
          tabBarButton: ({
            children,
            style,
            onPress,
            onLongPress,
            accessibilityLabel,
            accessibilityState,
            testID,
          }) => (
            <TouchableOpacity
              onPress={onPress ?? undefined}
              onLongPress={onLongPress ?? undefined}
              accessibilityLabel={accessibilityLabel}
              accessibilityState={accessibilityState}
              testID={testID}
              style={[style, { marginTop: -12 }]}
              activeOpacity={0.8}
            >
              {children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "bell" : "bell-outline"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconButton 
                icon={focused ? "account" : "account-outline"} 
                size={20} 
                iconColor={color}
                style={{ margin: 0 }}
              />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const CitizenNavigator: React.FC = () => {
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
        component={CitizenTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'Collection Schedule',
        }}
      />
      <Stack.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          title: 'Learn & Educate',
        }}
      />
      <Stack.Screen
        name="BinScanner"
        component={BinScannerScreen}
        options={{
          headerShown: false,
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
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
    elevation: 8,
  },
});
