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
import { IconButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

interface ScheduleItem {
  id: string;
  date: string;
  day: string;
  time: string;
  area: string;
  type: 'collection' | 'recycling' | 'hazardous';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const ScheduleScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'upcoming' | 'past'>('upcoming');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Mock schedule data
  const scheduleData: ScheduleItem[] = [
    {
      id: '1',
      date: '15',
      day: 'Mon',
      time: '09:00 AM',
      area: 'Downtown Area',
      type: 'collection',
      status: 'scheduled',
    },
    {
      id: '2',
      date: '16',
      day: 'Tue',
      time: '10:30 AM',
      area: 'Residential Block',
      type: 'recycling',
      status: 'scheduled',
    },
    {
      id: '3',
      date: '17',
      day: 'Wed',
      time: '08:00 AM',
      area: 'Commercial Zone',
      type: 'collection',
      status: 'scheduled',
    },
    {
      id: '4',
      date: '18',
      day: 'Thu',
      time: '11:00 AM',
      area: 'Park District',
      type: 'hazardous',
      status: 'scheduled',
    },
    {
      id: '5',
      date: '12',
      day: 'Fri',
      time: '09:30 AM',
      area: 'City Center',
      type: 'collection',
      status: 'completed',
    },
  ];

  const filteredSchedule = scheduleData.filter((item) => {
    if (selectedFilter === 'upcoming') {
      return item.status === 'scheduled';
    }
    return item.status === 'completed' || item.status === 'cancelled';
  });

  const getTypeColor = (type: string): readonly [string, string] => {
    switch (type) {
      case 'collection':
        return ['#4CAF50', '#81C784'] as const;
      case 'recycling':
        return ['#2196F3', '#64B5F6'] as const;
      case 'hazardous':
        return ['#FF9800', '#FFB74D'] as const;
      default:
        return ['#9E9E9E', '#BDBDBD'] as const;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'collection':
        return 'trash-can';
      case 'recycling':
        return 'recycle';
      case 'hazardous':
        return 'alert-circle';
      default:
        return 'calendar';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
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
              <Text style={styles.headerTitle}>Collection Schedule</Text>
              <Text style={styles.headerSubtitle}>View upcoming and past collections</Text>
            </View>
            <IconButton icon="calendar-month" size={32} iconColor={theme.colors.primary} />
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'upcoming' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('upcoming')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'upcoming' && styles.filterButtonTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'past' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('past')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === 'past' && styles.filterButtonTextActive,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Schedule List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredSchedule.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconButton icon="calendar-remove" size={64} iconColor={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No {selectedFilter} schedules</Text>
            </View>
          ) : (
            filteredSchedule.map((item, index) => (
              <Animated.View
                key={item.id}
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
                <Card style={styles.scheduleCard}>
                  <Card.Content>
                    <View style={styles.cardContent}>
                      {/* Date Section */}
                      <View style={styles.dateSection}>
                        <LinearGradient
                          colors={getTypeColor(item.type)}
                          style={styles.dateBadge}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Text style={styles.dateText}>{item.date}</Text>
                          <Text style={styles.dayText}>{item.day}</Text>
                        </LinearGradient>
                      </View>

                      {/* Details Section */}
                      <View style={styles.detailsSection}>
                        <View style={styles.typeHeader}>
                          <View style={styles.typeBadge}>
                            <IconButton
                              icon={getTypeIcon(item.type)}
                              size={16}
                              iconColor="#FFFFFF"
                              style={styles.typeIcon}
                            />
                            <Text style={styles.typeText}>
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.statusBadge,
                              { backgroundColor: getStatusBadgeColor(item.status) + '20' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                { color: getStatusBadgeColor(item.status) },
                              ]}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.infoRow}>
                          <IconButton
                            icon="clock-outline"
                            size={16}
                            iconColor={theme.colors.textSecondary}
                            style={styles.infoIcon}
                          />
                          <Text style={styles.infoText}>{item.time}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <IconButton
                            icon="map-marker-outline"
                            size={16}
                            iconColor={theme.colors.textSecondary}
                            style={styles.infoIcon}
                          />
                          <Text style={styles.infoText}>{item.area}</Text>
                        </View>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterButtonTextActive: {
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
  scheduleCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  cardContent: {
    flexDirection: 'row',
  },
  dateSection: {
    marginRight: theme.spacing.md,
  },
  dateBadge: {
    width: 60,
    height: 80,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: theme.spacing.xs / 2,
  },
  detailsSection: {
    flex: 1,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.md,
  },
  typeIcon: {
    margin: 0,
    marginRight: -theme.spacing.xs,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.round,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  infoIcon: {
    margin: 0,
    marginLeft: -theme.spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
});
