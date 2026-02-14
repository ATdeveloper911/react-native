import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { IconButton, Card, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  read: boolean;
  action?: string;
}

export const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Mock alerts data
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'Collection Scheduled',
        message: 'Waste collection scheduled for your area tomorrow at 9:00 AM',
        type: 'info',
        priority: 'medium',
        timestamp: '2 hours ago',
        read: false,
        action: 'View Schedule',
      },
      {
        id: '2',
        title: 'Bin Nearly Full',
        message: 'Main Street Bin is 85% full and needs attention',
        type: 'warning',
        priority: 'high',
        timestamp: '5 hours ago',
        read: false,
      },
      {
        id: '3',
        title: 'Recycling Day Reminder',
        message: 'Tomorrow is recycling day. Please separate your recyclables.',
        type: 'success',
        priority: 'low',
        timestamp: '1 day ago',
        read: true,
      },
      {
        id: '4',
        title: 'Route Delay',
        message: 'Collection route delayed by 30 minutes due to traffic',
        type: 'warning',
        priority: 'medium',
        timestamp: '2 days ago',
        read: true,
      },
      {
        id: '5',
        title: 'New Feature Available',
        message: 'You can now schedule collection appointments in the app!',
        type: 'info',
        priority: 'low',
        timestamp: '3 days ago',
        read: true,
      },
    ];

    setAlerts(mockAlerts);
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') return !alert.read;
    if (filter === 'high') return alert.priority === 'high';
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const getTypeColor = (type: string): readonly [string, string] => {
    switch (type) {
      case 'info':
        return ['#2196F3', '#64B5F6'] as const;
      case 'warning':
        return ['#FF9800', '#FFB74D'] as const;
      case 'error':
        return ['#F44336', '#E57373'] as const;
      case 'success':
        return ['#4CAF50', '#81C784'] as const;
      default:
        return ['#9E9E9E', '#BDBDBD'] as const;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'information';
      case 'warning':
        return 'alert';
      case 'error':
        return 'alert-circle';
      case 'success':
        return 'check-circle';
      default:
        return 'bell';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#F0F9F1', '#F5F7FA']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </Text>
            </View>
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['all', 'unread', 'high'].map((filterType) => (
              <TouchableOpacity
                key={filterType}
                style={[
                  styles.filterChip,
                  filter === filterType && styles.filterChipActive,
                ]}
                onPress={() => setFilter(filterType as any)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filter === filterType && styles.filterChipTextActive,
                  ]}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Alerts List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredAlerts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconButton icon="bell-off" size={64} iconColor={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No {filter} alerts</Text>
            </View>
          ) : (
            filteredAlerts.map((alert, index) => (
              <Animated.View
                key={alert.id}
                style={[
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => markAsRead(alert.id)}
                  style={styles.alertTouchable}
                >
                  <Card
                    style={[
                      styles.alertCard,
                      !alert.read && styles.alertCardUnread,
                    ]}
                  >
                    <Card.Content>
                      <View style={styles.alertContent}>
                        {/* Icon */}
                        <LinearGradient
                          colors={getTypeColor(alert.type)}
                          style={styles.alertIcon}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <IconButton
                            icon={getTypeIcon(alert.type)}
                            size={24}
                            iconColor="#FFFFFF"
                            style={styles.icon}
                          />
                        </LinearGradient>

                        {/* Content */}
                        <View style={styles.alertTextContainer}>
                          <View style={styles.alertHeader}>
                            <Text style={styles.alertTitle}>{alert.title}</Text>
                            {!alert.read && <View style={styles.unreadDot} />}
                          </View>
                          <Text style={styles.alertMessage} numberOfLines={2}>
                            {alert.message}
                          </Text>
                          <View style={styles.alertFooter}>
                            <View
                              style={[
                                styles.priorityBadge,
                                { backgroundColor: getPriorityColor(alert.priority) + '20' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.priorityText,
                                  { color: getPriorityColor(alert.priority) },
                                ]}
                              >
                                {alert.priority.toUpperCase()}
                              </Text>
                            </View>
                            <Text style={styles.timestamp}>{alert.timestamp}</Text>
                          </View>
                          {alert.action && (
                            <TouchableOpacity style={styles.actionButton}>
                              <Text style={styles.actionText}>{alert.action} →</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  badgeContainer: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.round,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  filterContainer: {
    marginBottom: theme.spacing.md,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    marginRight: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  alertTouchable: {
    marginBottom: theme.spacing.md,
  },
  alertCard: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  alertCardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  alertContent: {
    flexDirection: 'row',
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  icon: {
    margin: 0,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  alertMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.round,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionButton: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
