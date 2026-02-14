import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

interface AdminBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: 'grid-outline', iconActive: 'grid' },
  { id: 'Map', label: 'Map', icon: 'map-outline', iconActive: 'map' },
  { id: 'Reports', label: 'Reports', icon: 'document-text-outline', iconActive: 'document-text' },
  { id: 'Analytics', label: 'Analytics', icon: 'bar-chart-outline', iconActive: 'bar-chart' },
  { id: 'Profile', label: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
];

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.navContent}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => onTabChange(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Ionicons
                  name={(isActive ? item.iconActive : item.icon) as any}
                  size={20}
                  color={isActive ? theme.colors.secondary : theme.colors.textSecondary}
                />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface + 'F5', // 95% opacity
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    paddingHorizontal: 8,
    ...theme.shadows.md,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    padding: 6,
    borderRadius: theme.borderRadius.md,
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: theme.colors.secondary + '26', // 15% opacity
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  labelActive: {
    color: theme.colors.secondary,
    fontWeight: '600',
  },
});
