import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, Image, Animated, Dimensions, Linking, Alert } from 'react-native';
import { Card, Text, Title, Paragraph, Button, Chip, IconButton, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { binService } from '../../services/binService';
import { Bin, WorkerStackParamList } from '../../types';
import { theme } from '../../utils/theme';

type NavigationProp = StackNavigationProp<WorkerStackParamList>;

const { width, height } = Dimensions.get('window');

const fallbackBins: Bin[] = [
  {
    id: 'bin-1',
    name: 'Bin 1 - Liberty Market',
    location: { latitude: 31.5105, longitude: 74.3440 },
    fillLevel: 35,
    status: 'filling',
    zone: 'Gulberg III',
    lastUpdate: Date.now() - 3600000,
    isOnline: true,
  },
  {
    id: 'bin-2',
    name: 'Bin 2 - Model Town',
    location: { latitude: 31.4700, longitude: 74.3500 },
    fillLevel: 78,
    status: 'full',
    zone: 'Model Town',
    lastUpdate: Date.now() - 1800000,
    isOnline: true,
  },
  {
    id: 'bin-3',
    name: 'Bin 3 - DHA Phase 5',
    location: { latitude: 31.4600, longitude: 74.3600 },
    fillLevel: 95,
    status: 'overflow',
    zone: 'DHA',
    lastUpdate: Date.now() - 900000,
    isOnline: true,
  },
  {
    id: 'bin-4',
    name: 'Bin 4 - Gulberg II',
    location: { latitude: 31.5200, longitude: 74.3300 },
    fillLevel: 12,
    status: 'empty',
    zone: 'Gulberg II',
    lastUpdate: Date.now() - 2700000,
    isOnline: true,
  },
  {
    id: 'bin-5',
    name: 'Bin 5 - Garden Town',
    location: { latitude: 31.4800, longitude: 74.3400 },
    fillLevel: 45,
    status: 'filling',
    zone: 'Garden Town',
    lastUpdate: Date.now() - 4500000,
    isOnline: false,
  },
  {
    id: 'bin-6',
    name: 'Bin 6 - Mall Road',
    location: { latitude: 31.4900, longitude: 74.3200 },
    fillLevel: 88,
    status: 'full',
    zone: 'Liberty',
    lastUpdate: Date.now() - 1200000,
    isOnline: true,
  },
  {
    id: 'bin-7',
    name: 'Bin 7 - Fortress Stadium',
    location: { latitude: 31.5000, longitude: 74.3500 },
    fillLevel: 92,
    status: 'overflow',
    zone: 'Cantonment',
    lastUpdate: Date.now() - 600000,
    isOnline: true,
  },
  {
    id: 'bin-8',
    name: 'Bin 8 - Model Town',
    location: { latitude: 31.4700, longitude: 74.3500 },
    fillLevel: 75,
    status: 'full',
    zone: 'Model Town',
    lastUpdate: Date.now() - 1800000,
    isOnline: true,
  },
  {
    id: 'bin-9',
    name: 'Bin 9 - Gulberg',
    location: { latitude: 31.5200, longitude: 74.3400 },
    fillLevel: 85,
    status: 'full',
    zone: 'Gulberg',
    lastUpdate: Date.now() - 900000,
    isOnline: true,
  },
  {
    id: 'bin-10',
    name: 'Bin 10 - DHA',
    location: { latitude: 31.4600, longitude: 74.3700 },
    fillLevel: 65,
    status: 'filling',
    zone: 'DHA',
    lastUpdate: Date.now() - 2400000,
    isOnline: true,
  },
];

export const WorkerDashboardScreen: React.FC = () => {
  const { user, userData } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [assignedBins, setAssignedBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [emptyingBin, setEmptyingBin] = useState<string | null>(null);
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const workerId = user?.uid || userData?.id || null;

  useEffect(() => {
    if (!workerId) return;

    setLoading(true);
    let didReceiveFirstUpdate = false;
    const safetyTimer = setTimeout(() => {
      if (!didReceiveFirstUpdate) {
        console.warn('Worker bins subscription timeout - showing empty state');
        setAssignedBins([]);
        setLoading(false);
      }
    }, 6000);

    // Subscribe to bins assigned to this worker
    const unsubscribe = binService.subscribeToBins((binsData) => {
      didReceiveFirstUpdate = true;
      clearTimeout(safetyTimer);
      const byId = new Map<string, Bin>();
      fallbackBins.forEach((b) => byId.set(b.id, b));
      binsData.forEach((b) => byId.set(b.id, { ...byId.get(b.id), ...b, id: b.id } as Bin));
      const mergedBins = Array.from(byId.values());

      const workerBins = mergedBins.filter((bin: any) =>
        bin.assignedWorkerId === workerId &&
        bin.status !== 'empty' &&
        bin.status !== 'offline' &&
        bin.location &&
        typeof bin.location.latitude === 'number' &&
        typeof bin.location.longitude === 'number'
      );
      setAssignedBins(workerBins);
      setLoading(false);
      setRefreshing(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, [workerId]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const getStatusColor = (status: Bin['status']) => {
    switch (status) {
      case 'empty':
        return '#10B981';
      case 'filling':
        return '#F59E0B';
      case 'full':
        return '#EF4444';
      case 'overflow':
        return '#DC2626';
      case 'offline':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: Bin['status']) => {
    switch (status) {
      case 'empty':
        return 'Empty';
      case 'filling':
        return 'Filling';
      case 'full':
        return 'Full';
      case 'overflow':
        return 'Overflow';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getPriorityLevel = (fillLevel: number) => {
    if (fillLevel >= 90) return { text: 'URGENT', color: '#DC2626' };
    if (fillLevel >= 75) return { text: 'High', color: '#EF4444' };
    if (fillLevel >= 50) return { text: 'Medium', color: '#F59E0B' };
    return { text: 'Low', color: '#10B981' };
  };

  const getUserInitials = () => {
    if (userData?.name) {
      const initials = userData.name
        .split(' ')
        .map((n) => n?.trim())
        .filter((n) => Boolean(n))
        .map((n) => n![0])
        .filter((ch) => Boolean(ch))
        .join('')
        .toUpperCase()
        .substring(0, 2);

      return initials || 'W';
    }
    return 'W';
  };

  const showProfilePicture = () => {
    if (!userData?.profilePicture) {
      navigation.navigate('Profile');
      return;
    }
    
    setShowProfileModal(true);
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideProfilePicture = () => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowProfileModal(false);
    });
  };

  const handleGetDirections = (bin: Bin) => {
    if (!bin.location || typeof bin.location.latitude !== 'number' || typeof bin.location.longitude !== 'number') {
      Alert.alert('Error', 'Location unavailable for this bin');
      return;
    }

    const { latitude, longitude } = bin.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Google Maps');
      }
    });
  };

  const handleEmptyBin = (bin: Bin) => {
    setEmptyingBin(bin.id);
    // Navigate to QR scanner for this specific bin
    navigation.navigate('TaskDetail', { taskId: bin.id });
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={['#6366F1']}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Enhanced Header with Stats */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={showProfilePicture} activeOpacity={0.7}>
              {userData?.profilePicture ? (
                <Image source={{ uri: userData.profilePicture }} style={styles.avatarImage} />
              ) : (
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.avatar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.avatarText}>{getUserInitials()}</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.name}>{userData?.name || 'Worker'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={showProfilePicture} activeOpacity={0.7}>
            <View style={styles.notificationBadge}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              <View style={styles.notificationDot}>
                <Text style={styles.notificationDotText}>2</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trash-outline" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>{assignedBins.length}</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="warning-outline" size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>
              {assignedBins.filter(b => b.fillLevel >= 75).length}
            </Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>
              {assignedBins.filter(b => b.fillLevel < 50).length}
            </Text>
            <Text style={styles.statLabel}>Low Priority</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionButton} onPress={() => navigation.navigate('WorkerMap')}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="map-outline" size={24} color="#6366F1" />
            </View>
            <Text style={styles.quickActionText}>View Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="stats-chart-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.quickActionText}>Statistics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={styles.quickActionIcon}>
              <Ionicons name="time-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks Section */}
      <View style={styles.tasksSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.inlineLoadingRow}>
            <ActivityIndicator size="small" color="#059669" />
            <Text style={styles.inlineLoadingText}>Loading your tasks...</Text>
          </View>
        ) : assignedBins.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
            </View>
            <Text style={styles.emptyTitle}>All Tasks Completed!</Text>
            <Text style={styles.emptySubtitle}>
              Great job! No bins assigned to you right now.
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Ionicons name="refresh-outline" size={20} color="#6366F1" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          assignedBins.map((bin) => {
            const priority = getPriorityLevel(bin.fillLevel);
            return (
              <TouchableOpacity
                key={bin.id}
                activeOpacity={0.7}
                onPress={() => handleEmptyBin(bin)}
              >
                <View style={styles.taskCard}>
                  <View style={styles.taskHeader}>
                    <View style={styles.taskLeft}>
                      <View style={[styles.priorityIndicator, { backgroundColor: priority.color }]} />
                      <View style={styles.taskInfo}>
                        <Text style={styles.taskTitle}>{bin.name || `Bin ${bin.id}`}</Text>
                        <Text style={styles.taskLocation}>{bin.zone}</Text>
                      </View>
                    </View>
                    <View style={styles.taskRight}>
                      <View style={styles.fillLevelBadge}>
                        <Text style={styles.fillLevelText}>{bin.fillLevel}%</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.taskBody}>
                    <View style={styles.taskRow}>
                      <View style={styles.taskItem}>
                        <Ionicons name="location-outline" size={16} color="#64748B" />
                        <Text style={styles.taskItemText}>
                          {bin.location?.latitude?.toFixed?.(4) ?? 'N/A'}, {bin.location?.longitude?.toFixed?.(4) ?? 'N/A'}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.taskRow}>
                      <View style={styles.taskItem}>
                        <Ionicons name="time-outline" size={16} color="#64748B" />
                        <Text style={styles.taskItemText}>
                          Updated {formatTimeAgo(bin.lastUpdate)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.taskChips}>
                      <View style={[styles.chip, { backgroundColor: priority.color + '20' }]}>
                        <Text style={[styles.chipText, { color: priority.color }]}>
                          {priority.text}
                        </Text>
                      </View>
                      <View style={[styles.chip, { backgroundColor: getStatusColor(bin.status) + '20' }]}>
                        <Text style={[styles.chipText, { color: getStatusColor(bin.status) }]}>
                          {getStatusLabel(bin.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.taskActions}>
                    <TouchableOpacity
                      style={styles.directionsButton}
                      onPress={() => handleGetDirections(bin)}
                    >
                      <Ionicons name="map-outline" size={18} color="#6366F1" />
                      <Text style={styles.directionsButtonText}>Navigate</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.emptyButton}
                      onPress={() => handleEmptyBin(bin)}
                    >
                      <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.emptyButtonText}>Empty Bin</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },

  inlineLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: theme.spacing.lg,
  },
  inlineLoadingText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Enhanced Header
  headerGradient: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: theme.spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  notificationBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationDotText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  
  // Quick Actions
  quickActionsContainer: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: theme.spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  
  // Tasks Section
  tasksSection: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyIcon: {
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  
  // Task Cards
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: theme.spacing.md,
    height: 40,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: theme.spacing.xs,
  },
  taskLocation: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  fillLevelBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  fillLevelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  
  // Task Body
  taskBody: {
    marginBottom: theme.spacing.md,
  },
  taskRow: {
    marginBottom: theme.spacing.sm,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItemText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  taskChips: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Task Actions
  taskActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: theme.spacing.sm,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  directionsButtonText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  emptyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: theme.spacing.sm,
    borderRadius: 12,
    gap: theme.spacing.sm,
  },
  emptyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Avatar
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Modal styles (keeping existing)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullProfileImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    marginTop: 20,
    marginBottom: 20,
  },
  modalFooter: {
    alignItems: 'center',
    width: '100%',
  },
  modalUserName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  editProfileButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});

