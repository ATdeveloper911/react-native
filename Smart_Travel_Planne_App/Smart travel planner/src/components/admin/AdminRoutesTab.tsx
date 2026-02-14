import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

interface CollectionRoute {
  id: string;
  name: string;
  bins: number;
  distance: string;
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
}

interface AdminRoutesTabProps {
  routes?: CollectionRoute[];
}

// Mock data - replace with real data from your service
const mockRoutes: CollectionRoute[] = [
  { 
    id: '1', 
    name: 'Route A - North Zone', 
    bins: 8, 
    distance: '12.5 km', 
    estimatedTime: '45 min', 
    status: 'in-progress', 
    assignedTo: 'Zainab Ali' 
  },
  { 
    id: '2', 
    name: 'Route B - Central', 
    bins: 12, 
    distance: '18.2 km', 
    estimatedTime: '1h 15min', 
    status: 'pending' 
  },
  { 
    id: '3', 
    name: 'Route C - South Zone', 
    bins: 6, 
    distance: '8.7 km', 
    estimatedTime: '30 min', 
    status: 'completed', 
    assignedTo: 'Ahmad Khan' 
  },
];

export const AdminRoutesTab: React.FC<AdminRoutesTabProps> = ({ routes = mockRoutes }) => {
  const getStatusColor = (status: CollectionRoute['status']) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'in-progress': return theme.colors.primary;
      case 'pending': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusLabel = (status: CollectionRoute['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <View style={styles.container}>
      {/* Route Optimization Card */}
      <Card style={styles.optimizationCard}>
        <LinearGradient
          colors={[theme.colors.primary + '15', theme.colors.primary + '08']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.optimizationGradient}
        >
          <Card.Content style={styles.optimizationContent}>
            <View style={styles.optimizationIconContainer}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.optimizationIconBg}
              >
                <Ionicons name="navigate" size={20} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View style={styles.optimizationInfo}>
              <Text style={styles.optimizationTitle}>AI Route Optimization</Text>
              <Text style={styles.optimizationSubtitle}>Saves 23% fuel & 18% time</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </Card.Content>
        </LinearGradient>
      </Card>

      {/* Routes List */}
      <View style={styles.routesList}>
        {routes.map((route) => (
          <Card 
            key={route.id} 
            style={[
              styles.routeCard,
              route.status === 'in-progress' && styles.routeCardActive
            ]}
          >
            <Card.Content style={styles.routeContent}>
              <View style={styles.routeHeader}>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeName}>{route.name}</Text>
                  <Text style={styles.routeMeta}>
                    {route.bins} bins • {route.distance}
                  </Text>
                </View>
                <Chip
                  mode="flat"
                  style={[
                    styles.routeStatusChip,
                    { backgroundColor: getStatusColor(route.status) + '20' }
                  ]}
                  textStyle={[
                    styles.routeStatusText,
                    { color: getStatusColor(route.status) }
                  ]}
                  icon={route.status === 'in-progress' ? () => (
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(route.status) }]} />
                  ) : undefined}
                >
                  {getStatusLabel(route.status)}
                </Chip>
              </View>

              <View style={styles.routeFooter}>
                <View style={styles.routeTime}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.routeTimeText}>{route.estimatedTime}</Text>
                </View>
                {route.assignedTo ? (
                  <View style={styles.routeAssigned}>
                    <Ionicons name="person-check-outline" size={14} color={theme.colors.primary} />
                    <Text style={styles.routeAssignedText}>{route.assignedTo}</Text>
                  </View>
                ) : (
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => {}}
                    style={styles.assignButton}
                    contentStyle={styles.assignButtonContent}
                    labelStyle={styles.assignButtonLabel}
                  >
                    Assign Worker
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(240, 249, 241, 0.3)', // Very light green with low opacity
  },
  optimizationCard: {
    margin: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  optimizationGradient: {
    borderRadius: theme.borderRadius.lg,
  },
  optimizationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  optimizationIconContainer: {
    marginRight: theme.spacing.sm,
  },
  optimizationIconBg: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optimizationInfo: {
    flex: 1,
  },
  optimizationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  optimizationSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  routesList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  routeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  routeCardActive: {
    borderWidth: 2,
    borderColor: theme.colors.primary + '40',
  },
  routeContent: {
    padding: theme.spacing.md,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  routeInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  routeMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  routeStatusChip: {
    height: 24,
  },
  routeStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  routeTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTimeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  routeAssigned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeAssignedText: {
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  assignButton: {
    borderColor: theme.colors.border,
  },
  assignButtonContent: {
    height: 28,
    paddingHorizontal: 12,
  },
  assignButtonLabel: {
    fontSize: 11,
  },
});
