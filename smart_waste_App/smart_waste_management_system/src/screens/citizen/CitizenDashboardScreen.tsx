import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { BinIcon } from '../../components/BinIcon';
import { binService } from '../../services/binService';
import { Bin } from '../../types';
import { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type NavigationProp = any;
const { width, height } = Dimensions.get('window');

export const CitizenDashboardScreen: React.FC = () => {
  const { userData } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    const unsubscribe = binService.subscribeToBins((binsData) => {
      setBins(binsData);
    });
    return () => unsubscribe();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 18) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  };

  const getBinStats = () => {
    // Use predefined bins if no bins from service
    const binsToUse = bins.length > 0 ? bins : [
      { status: 'empty' },
      { status: 'empty' },
      { status: 'filling' },
      { status: 'filling' },
      { status: 'full' },
    ];
    
    const total = binsToUse.length;
    const empty = binsToUse.filter(b => b.status === 'empty').length;
    const filling = binsToUse.filter(b => b.status === 'filling').length;
    const full = binsToUse.filter(b => b.status === 'full' || b.status === 'overflow').length;
    return { total, empty, filling, full };
  };

  const stats = getBinStats();

  const quickActions = [
    { 
      id: 1, 
      label: 'Scan Bin', 
      icon: 'qr-code-outline', 
      color: '#4CAF50',
      route: 'BinScanner' 
    },
    { 
      id: 2, 
      label: 'Report Issue', 
      icon: 'alert-circle-outline', 
      color: '#FF9800',
      route: 'Report' 
    },
    { 
      id: 3, 
      label: 'View Map', 
      icon: 'map-outline', 
      color: '#2196F3',
      route: 'Map' 
    },
    { 
      id: 4, 
      label: 'Schedule', 
      icon: 'calendar-outline', 
      color: '#9C27B0',
      route: 'Schedule' 
    },
  ];

  const recentBins = bins.slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.avatarContainer}>
              {userData?.profilePicture ? (
                <Image
                  source={{ uri: userData.profilePicture }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getUserInitials()}</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.userText}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{userData?.name || 'Citizen'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Bins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.empty}</Text>
            <Text style={styles.statLabel}>Empty</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.filling}</Text>
            <Text style={styles.statLabel}>Filling</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.full}</Text>
            <Text style={styles.statLabel}>Full</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                activeOpacity={0.8}
                onPress={() => {
                  if (action.route === 'Report' || action.route === 'Map') {
                    navigation.navigate(action.route);
                  } else {
                    const parentNav = navigation.getParent();
                    if (parentNav) {
                      parentNav.navigate(action.route);
                    }
                  }
                }}
              >
                <LinearGradient
                  colors={[action.color, action.color + 'DD']}
                  style={styles.quickActionIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={action.icon as any} size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Bins */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Bins</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.binsList}>
            {recentBins.map((bin) => (
              <TouchableOpacity key={bin.id} style={styles.binCard}>
                <View style={styles.binInfo}>
                  <View style={styles.binIconContainer}>
                    <BinIcon size={32} fillLevel={bin.fillLevel} />
                  </View>
                  <View style={styles.binDetails}>
                    <Text style={styles.binName}>{bin.name || `Bin ${bin.id}`}</Text>
                    <Text style={styles.binStatus}>
                      {bin.fillLevel}% full • {bin.status}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: bin.fillLevel >= 85 ? '#EF4444' : bin.fillLevel >= 50 ? '#F59E0B' : '#10B981' }
                ]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Environmental Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <LinearGradient
            colors={['#ECFDF5', '#D1FAE5']}
            style={styles.impactCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.impactContent}>
              <View style={styles.impactIcon}>
                <Ionicons name="leaf" size={32} color="#10B981" />
              </View>
              <View style={styles.impactText}>
                <Text style={styles.impactTitle}>Eco Warrior</Text>
                <Text style={styles.impactDescription}>
                  You've helped keep {stats.empty} bins clean this week!
                </Text>
              </View>
            </View>
            <View style={styles.impactStats}>
              <View style={styles.impactStat}>
                <Text style={styles.impactStatNumber}>12</Text>
                <Text style={styles.impactStatLabel}>Reports</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactStatNumber}>5</Text>
                <Text style={styles.impactStatLabel}>Scans</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  gradientBackground: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 70,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    marginTop: -20,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  binsList: {
    gap: 12,
  },
  binCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  binInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  binIconContainer: {
    marginRight: 12,
  },
  binDetails: {
    flex: 1,
  },
  binName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  binStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  impactCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  impactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  impactIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  impactText: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactStat: {
    alignItems: 'center',
  },
  impactStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#064E3B',
    marginBottom: 4,
  },
  impactStatLabel: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '500',
  },
});
