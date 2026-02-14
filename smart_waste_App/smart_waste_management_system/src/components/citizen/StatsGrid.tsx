import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { IconButton } from 'react-native-paper';
import { theme } from '../../utils/theme';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, trendUp, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <IconButton icon={icon} size={16} iconColor={theme.colors.primary} style={styles.icon} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {trend && (
        <Text style={[styles.trend, trendUp ? styles.trendUp : styles.trendDown]}>
          {trendUp ? '↑' : '↓'} {trend}
        </Text>
      )}
    </Animated.View>
  );
};

export const StatsGrid: React.FC = () => {
  const stats = [
    { icon: 'trash-can', label: 'Bins Monitored', value: '156', trend: '+12%', trendUp: true },
    { icon: 'trending-up', label: 'Collection Rate', value: '94%', trend: '+5%', trendUp: true },
    { icon: 'map-marker-path', label: 'Routes Today', value: '8', trend: '-2', trendUp: false },
    { icon: 'clock-outline', label: 'Avg Response', value: '25m', trend: '-10m', trendUp: true },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <View key={stat.label} style={[styles.cardWrapper, index % 2 === 0 && styles.cardWrapperEven]}>
          <StatCard {...stat} delay={index * 0.1} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.sm,
  },
  cardWrapper: {
    width: '50%',
    padding: theme.spacing.sm,
  },
  cardWrapperEven: {
    // This helps with spacing
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    margin: 0,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  trend: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendUp: {
    color: theme.colors.primary,
  },
  trendDown: {
    color: theme.colors.error,
  },
});
