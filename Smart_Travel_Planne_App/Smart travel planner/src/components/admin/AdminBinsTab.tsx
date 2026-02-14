import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput } from 'react-native';
import { Card, Button, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Bin } from '../../types';
import { theme } from '../../utils/theme';

interface AdminBinsTabProps {
  bins: Bin[];
}

type FilterType = 'All' | 'Full' | 'Filling' | 'Empty' | 'Offline';

export const AdminBinsTab: React.FC<AdminBinsTabProps> = ({ bins }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');

  const getStatusColor = (status: Bin['status']) => {
    switch (status) {
      case 'empty': return theme.colors.primary;
      case 'filling': return theme.colors.warning;
      case 'full': return theme.colors.error;
      case 'overflow': return '#D32F2F';
      case 'offline': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const filteredBins = bins.filter((bin) => {
    const matchesSearch = !searchQuery || 
      (bin.name || `Bin #${bin.id}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.location?.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'All' || bin.status === filter.toLowerCase() as Bin['status'];
    
    return matchesSearch && matchesFilter;
  });

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

  const filters: FilterType[] = ['All', 'Full', 'Filling', 'Empty', 'Offline'];

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search bins..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filterOption) => (
          <Button
            key={filterOption}
            mode={filter === filterOption ? 'contained' : 'outlined'}
            compact
            onPress={() => setFilter(filterOption)}
            style={[
              styles.filterButton,
              filter === filterOption && styles.filterButtonActive
            ]}
            contentStyle={styles.filterButtonContent}
            labelStyle={[
              styles.filterButtonLabel,
              filter === filterOption && styles.filterButtonLabelActive
            ]}
          >
            {filterOption}
          </Button>
        ))}
      </ScrollView>

      {/* Bins List */}
      <View style={styles.binsList}>
        {filteredBins.map((bin) => (
          <Card key={bin.id} style={styles.binCard}>
            <Card.Content style={styles.binContent}>
              <View style={[styles.binIconContainer, { backgroundColor: getStatusColor(bin.status) + '20' }]}>
                <Ionicons 
                  name="trash-outline" 
                  size={24} 
                  color={bin.status === 'offline' ? theme.colors.textSecondary : getStatusColor(bin.status)} 
                />
              </View>
              <View style={styles.binInfo}>
                <View style={styles.binHeader}>
                  <Text style={styles.binName}>{bin.name || `Bin #${bin.id}`}</Text>
                  <View style={[
                    styles.binBadge,
                    (bin.status === 'overflow' || bin.status === 'full') && styles.binBadgeDanger
                  ]}>
                    <Text style={[
                      styles.binBadgeText,
                      (bin.status === 'overflow' || bin.status === 'full') && styles.binBadgeTextDanger
                    ]}>
                      {bin.fillLevel}%
                    </Text>
                  </View>
                </View>
                <View style={styles.binFooter}>
                  <View style={styles.binLocation}>
                    <Ionicons name="location-outline" size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.binLocationText}>
                      {bin.location?.address || 'Unknown location'}
                    </Text>
                  </View>
                  <Text style={styles.binTime}>{formatTimeAgo(bin.lastUpdate)}</Text>
                </View>
                <ProgressBar 
                  progress={bin.fillLevel / 100} 
                  color={getStatusColor(bin.status)}
                  style={styles.binProgress}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
        {filteredBins.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No bins found</Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: theme.spacing.md,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    padding: 0,
  },
  filtersContainer: {
    marginBottom: theme.spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterButton: {
    marginRight: theme.spacing.xs,
    borderRadius: 10,
  },
  filterButtonActive: {
    backgroundColor: '#059669',
  },
  filterButtonContent: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  filterButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterButtonLabelActive: {
    color: '#FFFFFF',
  },
  binsList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  binCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  binContent: {
    flexDirection: 'row',
    padding: theme.spacing.md,
  },
  binIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  binInfo: {
    flex: 1,
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  binName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  binBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  binBadgeDanger: {
    backgroundColor: '#FEE2E2',
  },
  binBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  binBadgeTextDanger: {
    color: '#EF4444',
  },
  binFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  binLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  binLocationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
  },
  binTime: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  binProgress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    padding: theme.spacing.xl,
    fontWeight: '500',
  },
});
