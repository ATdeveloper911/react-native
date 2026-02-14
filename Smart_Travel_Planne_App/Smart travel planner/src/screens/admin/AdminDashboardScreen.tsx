import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Image, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { binService } from '../../services/binService';
import { Bin } from '../../types';
import { AdminStackParamList } from '../../navigation/AdminNavigator';
import { theme } from '../../utils/theme';
import { AdminSimpleHeader } from '../../components/admin/AdminSimpleHeader';
import { AdminOverviewTab } from '../../components/admin/AdminOverviewTab';
import { AdminBinsTab } from '../../components/admin/AdminBinsTab';
import { AdminWorkersTab } from '../../components/admin/AdminWorkersTab';

type NavigationProp = StackNavigationProp<AdminStackParamList>;

type TabType = 'overview' | 'bins' | 'workers';

export const AdminDashboardScreen: React.FC = () => {
  const { userData } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [bins, setBins] = useState<Bin[]>([]);
  const [preselectBinId, setPreselectBinId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    full: 0,
    overflow: 0,
    offline: 0,
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  // Mock bins data with proper names and IDs
  const mockBins: Bin[] = [
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
      // No assignedWorkerId - available for assignment
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
      // No assignedWorkerId - available for assignment
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
      // No assignedWorkerId - available for assignment
      dumpCount: 8,
      lastDumpAt: Date.now() - 4800000,
    },
  ];

  useEffect(() => {
    // Use mock data for now to ensure bins show up in dashboard
    const binsData = mockBins;
    setBins(binsData);
    setStats({
      total: binsData.length,
      full: binsData.filter((b) => b.status === 'full').length,
      overflow: binsData.filter((b) => b.status === 'overflow').length,
      offline: binsData.filter((b) => b.status === 'offline').length,
    });

    // Also subscribe to real-time updates
    const unsubscribe = binService.subscribeToBins((realTimeBins) => {
      if (!realTimeBins || realTimeBins.length === 0) return;

      const byId = new Map<string, Bin>();
      mockBins.forEach((b) => byId.set(b.id, b));
      realTimeBins.forEach((b) => byId.set(b.id, { ...byId.get(b.id), ...b } as Bin));

      const mergedBins = Array.from(byId.values());
      setBins(mergedBins);
      setStats({
        total: mergedBins.length,
        full: mergedBins.filter((b) => b.status === 'full').length,
        overflow: mergedBins.filter((b) => b.status === 'overflow').length,
        offline: mergedBins.filter((b) => b.status === 'offline').length,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AdminOverviewTab
            bins={bins}
            stats={stats}
            onAssignBin={(binId) => {
              setPreselectBinId(binId);
              setActiveTab('workers');
            }}
          />
        );
      case 'bins':
        return <AdminBinsTab bins={bins} />;
      case 'workers':
        return (
          <AdminWorkersTab
            preselectBinId={preselectBinId}
            onClearPreselectBinId={() => setPreselectBinId(null)}
          />
        );
      default:
        return (
          <AdminOverviewTab
            bins={bins}
            stats={stats}
            onAssignBin={(binId) => {
              setPreselectBinId(binId);
              setActiveTab('workers');
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Simple Header with Profile Picture and Statistics */}
        <AdminSimpleHeader 
          userData={userData || undefined} 
          onProfilePress={showProfilePicture}
          stats={{
            total: stats.total,
            full: stats.full + stats.overflow,
            available: 3, // Mock available workers
            routes: 2, // Mock active routes
          }}
        />

        {/* Tabs Navigation */}
        <View style={styles.tabsContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabType)}
            buttons={[
              {
                value: 'overview',
                label: 'Overview',
              },
              {
                value: 'bins',
                label: 'Bins',
              },
              {
                value: 'workers',
                label: 'Workers',
              },
            ]}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#4CAF50',
                onSecondaryContainer: '#FFFFFF',
              },
            }}
          />
        </View>

        {/* Tab Content - Scrollable */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderTabContent()}
        </ScrollView>
      </View>

      {/* Profile Picture Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="none"
        onRequestClose={hideProfilePicture}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={hideProfilePicture}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                { 
                  transform: [{ scale: modalScale }],
                  opacity: modalOpacity 
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={hideProfilePicture}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
              
              {userData?.profilePicture && (
                <Image 
                  source={{ uri: userData.profilePicture }} 
                  style={styles.fullProfileImage}
                  resizeMode="contain"
                />
              )}
              
              <View style={styles.modalFooter}>
                <Text style={styles.modalUserName}>{userData?.name || 'Admin'}</Text>
                <TouchableOpacity 
                  style={styles.editProfileButton}
                  onPress={() => {
                    hideProfilePicture();
                    navigation.navigate('Profile');
                  }}
                >
                  <View style={styles.editButtonContent}>
                    <Ionicons name="camera" size={16} color="#ffffff" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  segmentedButtons: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
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
    width: '90%',
    maxHeight: '80%',
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
    width: 280,
    height: 280,
    borderRadius: 140,
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
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
