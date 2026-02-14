import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Card, Button, Chip, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { binService } from '../../services/binService';
import { Bin } from '../../types';
import { theme } from '../../utils/theme';

interface Worker {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  tasksCompleted: number;
  assignedBins?: string[];
  avatar: string;
}

type WorkerUser = {
  id: string;
  name?: string;
  email?: string;
  isActive?: boolean;
};

interface AdminWorkersTabProps {
  workers?: Worker[];
  preselectBinId?: string | null;
  onClearPreselectBinId?: () => void;
}

// Mock workers data
const mockWorkers: Worker[] = [
  { id: 'worker-1', name: 'Ahmad Khan', status: 'available', tasksCompleted: 12, assignedBins: [], avatar: 'AK' },
  { id: 'worker-2', name: 'Zainab Ali', status: 'busy', tasksCompleted: 8, assignedBins: ['bin-2', 'bin-7'], avatar: 'ZA' },
  { id: 'worker-3', name: 'Hassan Raza', status: 'available', tasksCompleted: 15, assignedBins: [], avatar: 'HR' },
  { id: 'worker-4', name: 'Fatima Noor', status: 'offline', tasksCompleted: 6, assignedBins: [], avatar: 'FN' },
  { id: 'worker-5', name: 'Omar Sheikh', status: 'available', tasksCompleted: 10, assignedBins: [], avatar: 'OS' },
];

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
    assignedWorkerId: 'worker-1',
    dumpCount: 12,
    lastDumpAt: Date.now() - 7200000,
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
    assignedWorkerId: 'worker-2',
    dumpCount: 8,
    lastDumpAt: Date.now() - 5400000,
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
    assignedWorkerId: 'worker-3',
    dumpCount: 15,
    lastDumpAt: Date.now() - 3600000,
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
    assignedWorkerId: 'worker-4',
    dumpCount: 6,
    lastDumpAt: Date.now() - 6300000,
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
    assignedWorkerId: 'worker-5',
    dumpCount: 10,
    lastDumpAt: Date.now() - 8100000,
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
    assignedWorkerId: 'worker-1',
    dumpCount: 20,
    lastDumpAt: Date.now() - 9600000,
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
    assignedWorkerId: 'worker-2',
    dumpCount: 18,
    lastDumpAt: Date.now() - 7200000,
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
    dumpCount: 12,
    lastDumpAt: Date.now() - 5400000,
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
    dumpCount: 15,
    lastDumpAt: Date.now() - 6300000,
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
    dumpCount: 8,
    lastDumpAt: Date.now() - 4800000,
  },
];

export const AdminWorkersTab: React.FC<AdminWorkersTabProps> = ({ 
  workers = mockWorkers,
  preselectBinId = null,
  onClearPreselectBinId,
}) => {
  const [realtimeWorkers, setRealtimeWorkers] = useState<WorkerUser[]>([]);
  const [realtimeBins, setRealtimeBins] = useState<Bin[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [showBinModal, setShowBinModal] = useState(false);
  const [availableBins, setAvailableBins] = useState<Bin[]>([]);
  const [selectedBins, setSelectedBins] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [loadingBins, setLoadingBins] = useState(false);

  useEffect(() => {
    const unsubWorkers = authService.subscribeToWorkers((ws) => {
      setRealtimeWorkers(
        ws.map((w) => ({
          id: w.id,
          name: w.name,
          email: w.email,
          isActive: w.isActive,
        }))
      );
    });

    const unsubBins = binService.subscribeToBins((bs) => {
      setRealtimeBins(bs);
    });

    return () => {
      unsubWorkers();
      unsubBins();
    };
  }, []);

  const derivedWorkers: Worker[] = useMemo(() => {
    if (!realtimeWorkers || realtimeWorkers.length === 0) return workers;

    const assignedBinsByWorker = new Map<string, string[]>();
    (realtimeBins.length > 0 ? realtimeBins : fallbackBins).forEach((b) => {
      if (!b.assignedWorkerId) return;
      const prev = assignedBinsByWorker.get(b.assignedWorkerId) ?? [];
      assignedBinsByWorker.set(b.assignedWorkerId, [...prev, b.id]);
    });

    return realtimeWorkers.map((w) => {
      const assignedBins = assignedBinsByWorker.get(w.id) ?? [];
      const isOffline = w.isActive === false;
      const status: Worker['status'] = isOffline ? 'offline' : assignedBins.length > 0 ? 'busy' : 'available';
      const name = w.name || w.email?.split('@')[0] || 'Worker';
      const avatar = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('') || 'W';

      return {
        id: w.id,
        name,
        status,
        tasksCompleted: 0,
        assignedBins,
        avatar,
      };
    });
  }, [realtimeWorkers, realtimeBins, workers]);

  const availableWorkers = derivedWorkers.filter(w => w.status === 'available').length;

  const getStatusColor = (status: Worker['status']) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: Worker['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const loadAvailableBins = async (): Promise<Bin[]> => {
    setLoadingBins(true);
    try {
      const binsData = await binService.getBinsOnce();
      const byId = new Map<string, Bin>();
      fallbackBins.forEach((b) => byId.set(b.id, b));
      binsData.forEach((b) => byId.set(b.id, { ...byId.get(b.id), ...b } as Bin));

      const mergedBins = Array.from(byId.values());
      const knownWorkerIds = new Set(derivedWorkers.map((w) => w.id));

      const unassignedBins = mergedBins.filter((bin) => {
        if (!bin.assignedWorkerId) return true;
        return !knownWorkerIds.has(bin.assignedWorkerId);
      });

      setAvailableBins(unassignedBins);
      return unassignedBins;
    } catch (error) {
      console.error('Error loading bins:', error);
      const knownWorkerIds = new Set(derivedWorkers.map((w) => w.id));
      const unassignedBins = fallbackBins.filter((bin) => {
        if (!bin.assignedWorkerId) return true;
        return !knownWorkerIds.has(bin.assignedWorkerId);
      });
      setAvailableBins(unassignedBins);
      return unassignedBins;
    } finally {
      setLoadingBins(false);
    }
  };

  const handleAssignTask = async (worker: Worker) => {
    setSelectedWorker(worker);
    setSelectedBins([]);
    const binsForAssign = await loadAvailableBins();
    if (preselectBinId && binsForAssign.some((b) => b.id === preselectBinId)) {
      setSelectedBins([preselectBinId]);
      onClearPreselectBinId?.();
    }
    setShowBinModal(true);
  };

  const toggleBinSelection = (binId: string) => {
    setSelectedBins(prev => 
      prev.includes(binId) 
        ? prev.filter(id => id !== binId)
        : [...prev, binId]
    );
  };

  const handleAssignBins = async () => {
    if (!selectedWorker || selectedBins.length === 0) return;

    setAssigning(true);
    try {
      // Assign each selected bin to the worker
      for (const binId of selectedBins) {
        await binService.updateBin(binId, {
          assignedWorkerId: selectedWorker.id,
          assignedAt: Date.now(),
          assignedBy: 'admin',
        });
      }

      Alert.alert(
        '✅ Task Assigned Successfully!',
        `${selectedBins.length} bin(s) assigned to ${selectedWorker.name}`,
        [{ text: 'OK' }]
      );

      setShowBinModal(false);
      setSelectedWorker(null);
      setSelectedBins([]);
    } catch (error) {
      console.error('Error assigning bins:', error);
      Alert.alert(
        '❌ Assignment Failed',
        'Failed to assign bins. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setAssigning(false);
    }
  };

  const getPriorityColor = (fillLevel: number) => {
    if (fillLevel >= 90) return '#DC2626';
    if (fillLevel >= 75) return '#EF4444';
    if (fillLevel >= 50) return '#F59E0B';
    return '#10B981';
  };

  const getStatusColorForBin = (status: Bin['status']) => {
    switch (status) {
      case 'empty': return '#10B981';
      case 'filling': return '#F59E0B';
      case 'full': return '#EF4444';
      case 'overflow': return '#DC2626';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collection Workers</Text>
        <Chip
          mode="flat"
          style={styles.headerChip}
          textStyle={styles.headerChipText}
        >
          {availableWorkers} available
        </Chip>
      </View>

      {/* Workers List */}
      <ScrollView style={styles.workersList} showsVerticalScrollIndicator={false}>
        {derivedWorkers.map((worker) => (
          <Card
            key={worker.id}
            style={[
              styles.workerCard,
              selectedWorker?.id === worker.id && styles.workerCardSelected
            ]}
          >
            <Card.Content style={styles.workerContent}>
              <View style={styles.workerMain}>
                <View style={styles.workerAvatarContainer}>
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    style={styles.workerAvatar}
                  >
                    <Text style={styles.workerAvatarText}>{worker.avatar}</Text>
                  </LinearGradient>
                  <View style={[
                    styles.workerStatusDot,
                    { backgroundColor: getStatusColor(worker.status) }
                  ]} />
                </View>
                <View style={styles.workerInfo}>
                  <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
                  <Text style={styles.workerDetails} numberOfLines={1}>
                    {worker.status === 'busy' && worker.assignedBins && worker.assignedBins.length > 0
                      ? `${worker.assignedBins.length} bins assigned`
                      : `${worker.tasksCompleted} tasks completed today`
                    }
                  </Text>
                </View>
                <View style={styles.workerActions}>
                  <Chip
                    mode="flat"
                    style={[
                      styles.workerStatusChip,
                      worker.status === 'available' && styles.workerStatusChipActive
                    ]}
                    textStyle={[
                      styles.workerStatusText,
                      worker.status === 'available' && styles.workerStatusTextActive
                    ]}
                  >
                    {getStatusLabel(worker.status)}
                  </Chip>
                  {worker.status === 'available' && (
                    <Button
                      mode="contained"
                      compact
                      onPress={() => handleAssignTask(worker)}
                      style={styles.assignButton}
                      contentStyle={styles.assignButtonContent}
                      labelStyle={styles.assignButtonText}
                    >
                      Assign Task
                    </Button>
                  )}
                </View>
              </View>

              {/* Show assigned bins for busy workers */}
              {worker.status === 'busy' && worker.assignedBins && worker.assignedBins.length > 0 && (
                <View style={styles.assignedBinsSection}>
                  <View style={styles.assignedBinsDivider} />
                  <Text style={styles.assignedBinsTitle}>Currently Assigned Bins:</Text>
                  <View style={styles.assignedBinsList}>
                    {worker.assignedBins.map((binId) => (
                      <Chip
                        key={binId}
                        mode="outlined"
                        style={styles.assignedBinChip}
                        textStyle={styles.assignedBinChipText}
                      >
                        {binId}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Bin Selection Modal */}
      <Modal
        visible={showBinModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowBinModal(false)}
            />
            <Text style={styles.modalTitle}>Assign Bins to {selectedWorker?.name}</Text>
            <View style={{ width: 48 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Select bins to assign (Tap to select/deselect)
            </Text>
            
            {loadingBins ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading available bins...</Text>
              </View>
            ) : availableBins.length === 0 ? (
              <View style={styles.emptyBinsContainer}>
                <Ionicons name="trash-outline" size={60} color="#64748B" />
                <Text style={styles.emptyBinsTitle}>No Available Bins</Text>
                <Text style={styles.emptyBinsSubtitle}>
                  All bins are either empty or already assigned to workers.
                </Text>
                <Button
                  mode="outlined"
                  onPress={loadAvailableBins}
                  style={styles.refreshButton}
                  icon="refresh"
                >
                  Refresh Bins
                </Button>
              </View>
            ) : (
              <View style={styles.binsList}>
                {availableBins.map((bin) => {
                  const isSelected = selectedBins.includes(bin.id);
                  return (
                    <TouchableOpacity
                      key={bin.id}
                      style={[
                        styles.binCard,
                        isSelected && styles.binCardSelected
                      ]}
                      onPress={() => toggleBinSelection(bin.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.binHeader}>
                        <View style={styles.binLeft}>
                          <View style={[
                            styles.binPriorityIndicator,
                            { backgroundColor: getPriorityColor(bin.fillLevel) }
                          ]} />
                          <View style={styles.binInfo}>
                            <Text style={styles.binName}>{bin.name || `Bin ${bin.id}`}</Text>
                            <Text style={styles.binLocation}>{bin.zone}</Text>
                          </View>
                        </View>
                        <View style={styles.binRight}>
                          <Text style={styles.binFillLevel}>{bin.fillLevel}%</Text>
                          <View style={[
                            styles.binStatusBadge,
                            { backgroundColor: getStatusColorForBin(bin.status) + '20' }
                          ]}>
                            <Text style={[
                              styles.binStatusText,
                              { color: getStatusColorForBin(bin.status) }
                            ]}>
                              {bin.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark-circle" size={20} color="#6366F1" />
                          <Text style={styles.selectedText}>Selected</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Text style={styles.selectionCount}>
              {selectedBins.length} bin{selectedBins.length !== 1 ? 's' : ''} selected
            </Text>
            <Button
              mode="contained"
              onPress={handleAssignBins}
              disabled={selectedBins.length === 0 || assigning}
              loading={assigning}
              style={styles.confirmButton}
              contentStyle={styles.confirmButtonContent}
            >
              Assign Selected Bins
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerChip: {
    backgroundColor: '#10B981',
    height: 26,
    borderRadius: 8,
  },
  headerChipText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  workersList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  workerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: theme.spacing.md,
  },
  workerCardSelected: {
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  workerContent: {
    padding: theme.spacing.md,
  },
  workerMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  workerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  workerStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  workerInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
    minWidth: 0,
  },
  workerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  workerDetails: {
    fontSize: 12,
    color: '#64748B',
  },
  workerActions: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  workerStatusChip: {
    backgroundColor: '#F1F5F9',
    height: 28,
    borderRadius: 8,
  },
  workerStatusChipActive: {
    backgroundColor: '#DCFCE7',
  },
  workerStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  workerStatusTextActive: {
    color: '#10B981',
  },
  assignButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  assignButtonContent: {
    paddingHorizontal: theme.spacing.sm,
  },
  assignButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Assigned Bins Section
  assignedBinsSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  assignedBinsDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: theme.spacing.sm,
  },
  assignedBinsTitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  assignedBinsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  assignedBinChip: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  assignedBinChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
  binsList: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  binCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  binCardSelected: {
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: '#F8FAFF',
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  binLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  binPriorityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: theme.spacing.md,
    height: 40,
  },
  binInfo: {
    flex: 1,
  },
  binName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: theme.spacing.xs,
  },
  binLocation: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  binRight: {
    alignItems: 'flex-end',
  },
  binFillLevel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: theme.spacing.xs,
  },
  binStatusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
  },
  binStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  selectedText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  modalFooter: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  selectionCount: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  confirmButtonContent: {
    paddingVertical: theme.spacing.sm,
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyBinsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyBinsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyBinsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  refreshButton: {
    borderColor: '#6366F1',
  },
});
