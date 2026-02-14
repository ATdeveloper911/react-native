import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminStackParamList } from '../../types';
import { theme } from '../../utils/theme';

type NavigationProp = StackNavigationProp<AdminStackParamList>;

interface AdminHeaderProps {
  userData?: {
    name?: string;
    profilePicture?: string;
  };
  onProfilePress: () => void;
  stats: {
    total: number;
    full: number;
    available: number;
    routes: number;
  };
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userData, onProfilePress, stats }) => {
  const navigation = useNavigation<NavigationProp>();

  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'A';
  };

  return (
    <LinearGradient
      colors={['#2196F3', '#42A5F5', '#64B5F6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={styles.subtitle}>Admin Panel</Text>
              <Text style={styles.title}>Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Reports')}
            >
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardDanger]}>
            <Ionicons name="warning-outline" size={20} color="#F44336" />
            <Text style={styles.statValue}>{stats.full}</Text>
            <Text style={styles.statLabel}>Full</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Ionicons name="people-outline" size={20} color="#4CAF50" />
            <Text style={styles.statValue}>{stats.available}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={[styles.statCard, styles.statCardAccent]}>
            <Ionicons name="map-outline" size={20} color="#FF9800" />
            <Text style={styles.statValue}>{stats.routes}</Text>
            <Text style={styles.statLabel}>Routes</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomLeftRadius: theme.borderRadius.xl,
    borderBottomRightRadius: theme.borderRadius.xl,
  },
  container: {
    paddingTop: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  statCardDanger: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  statCardPrimary: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  statCardAccent: {
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
});
