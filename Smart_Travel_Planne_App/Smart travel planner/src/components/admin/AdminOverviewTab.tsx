import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { Card, Button, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bin } from '../../types';
import { AdminStackParamList } from '../../navigation/AdminNavigator';
import { theme } from '../../utils/theme';

type NavigationProp = StackNavigationProp<AdminStackParamList>;

interface AdminOverviewTabProps {
  bins: Bin[];
  stats: {
    total: number;
    full: number;
    overflow: number;
    offline: number;
  };
  onAssignBin?: (binId: string) => void;
}

const cityMapBg = require('../../../assets/city-map-bg.png');

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ bins, stats, onAssignBin }) => {
  const navigation = useNavigation<NavigationProp>();
  const fullBins = bins.filter(b => b.status === 'full' || b.status === 'overflow');
  const urgentBins = fullBins.slice(0, 3);

  const getStatusColor = (status: Bin['status']) => {
    switch (status) {
      case 'empty': return '#4CAF50';
      case 'filling': return '#FF9800';
      case 'full': return '#F44336';
      case 'overflow': return '#D32F2F';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
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
    <View style={styles.container}>
      {/* Map Preview */}
      <Card style={styles.mapCard}>
        <View style={styles.mapContainer}>
          <Image source={cityMapBg} style={styles.mapImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', theme.colors.surface]}
            style={styles.mapGradient}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.mapInfo}>
              <Text style={styles.mapTitle}>Live Bin Map</Text>
              <Text style={styles.mapSubtitle}>{bins.length} bins tracked</Text>
            </View>
            <Button
              mode="contained"
              compact
              onPress={() => navigation.navigate('Bins')}
              style={[styles.mapButton, { backgroundColor: '#4CAF50' }]}
              contentStyle={styles.mapButtonContent}
              labelStyle={styles.mapButtonLabel}
              buttonColor="#4CAF50"
            >
              <Ionicons name="map-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              View Full Map
            </Button>
          </View>
        </View>
      </Card>

      {/* Active Alerts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Alerts</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{fullBins.length} urgent</Text>
            </View>
          </View>
        </View>
        <View style={styles.alertsList}>
          {urgentBins.map((bin) => (
            <Card key={bin.id} style={[styles.alertCard, { borderColor: getStatusColor(bin.status) + '40' }]}>
              <Card.Content style={styles.alertContent}>
                <View style={styles.alertLeft}>
                  <View style={[styles.alertDot, { backgroundColor: getStatusColor(bin.status) }]} />
                  <View style={styles.alertInfo}>
                    <Text style={styles.alertTitle}>
                      {bin.name || `Bin #${bin.id}`} - {bin.fillLevel}%
                    </Text>
                    <Text style={styles.alertLocation}>
                      {bin.location?.address || 'Unknown location'}
                    </Text>
                  </View>
                </View>
                <Button
                  mode="text"
                  compact
                  onPress={() => onAssignBin?.(bin.id)}
                  textColor={theme.colors.error}
                  labelStyle={styles.assignButtonLabel}
                >
                  Assign
                </Button>
              </Card.Content>
            </Card>
          ))}
          {urgentBins.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>No active alerts</Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </View>

      {/* Today's Performance */}
      <Card style={styles.performanceCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          <View style={styles.performanceList}>
            <View style={styles.performanceItem}>
              <View style={styles.performanceHeader}>
                <Text style={styles.performanceLabel}>Collections Completed</Text>
                <Text style={styles.performanceValue}>18/24</Text>
              </View>
              <ProgressBar progress={0.75} color={theme.colors.primary} style={styles.progressBar} />
            </View>
            <View style={styles.performanceItem}>
              <View style={styles.performanceHeader}>
                <Text style={styles.performanceLabel}>Route Efficiency</Text>
                <Text style={styles.performanceValue}>92%</Text>
              </View>
              <ProgressBar progress={0.92} color={theme.colors.success} style={styles.progressBar} />
            </View>
            <View style={styles.performanceItem}>
              <View style={styles.performanceHeader}>
                <Text style={styles.performanceLabel}>Response Time</Text>
                <Text style={styles.performanceValue}>Avg 12 min</Text>
              </View>
              <ProgressBar progress={0.85} color={theme.colors.info} style={styles.progressBar} />
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mapCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  mapContainer: {
    height: 140,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  mapInfo: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  mapButton: {
    borderRadius: 10,
    backgroundColor: '#059669',
  },
  mapButtonContent: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mapButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  alertsList: {
    gap: theme.spacing.sm,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 3,
  },
  alertLocation: {
    fontSize: 12,
    color: '#64748B',
  },
  assignButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
  performanceCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  performanceList: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  performanceItem: {
    gap: theme.spacing.xs,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
  },
});
