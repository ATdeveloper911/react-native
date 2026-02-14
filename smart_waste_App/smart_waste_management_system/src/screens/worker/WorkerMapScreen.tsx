import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { binService } from '../../services/binService';
import { Bin, WorkerStackParamList } from '../../types';
import { theme } from '../../utils/theme';

type NavigationProp = StackNavigationProp<WorkerStackParamList>;

const DEFAULT_REGION = {
  latitude: 31.5111,
  longitude: 74.3453,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

const fallbackBins: Bin[] = [
  {
    id: 'bin-1',
    name: 'Bin 1 - Liberty Market',
    location: { latitude: 31.5105, longitude: 74.344 },
    fillLevel: 35,
    status: 'filling',
    zone: 'Gulberg III',
    lastUpdate: Date.now() - 3600000,
    isOnline: true,
  },
  {
    id: 'bin-2',
    name: 'Bin 2 - Model Town',
    location: { latitude: 31.47, longitude: 74.35 },
    fillLevel: 78,
    status: 'full',
    zone: 'Model Town',
    lastUpdate: Date.now() - 1800000,
    isOnline: true,
  },
  {
    id: 'bin-3',
    name: 'Bin 3 - DHA Phase 5',
    location: { latitude: 31.46, longitude: 74.36 },
    fillLevel: 95,
    status: 'overflow',
    zone: 'DHA',
    lastUpdate: Date.now() - 900000,
    isOnline: true,
  },
  {
    id: 'bin-4',
    name: 'Bin 4 - Gulberg II',
    location: { latitude: 31.52, longitude: 74.33 },
    fillLevel: 12,
    status: 'empty',
    zone: 'Gulberg II',
    lastUpdate: Date.now() - 2700000,
    isOnline: true,
  },
  {
    id: 'bin-5',
    name: 'Bin 5 - Garden Town',
    location: { latitude: 31.48, longitude: 74.34 },
    fillLevel: 45,
    status: 'filling',
    zone: 'Garden Town',
    lastUpdate: Date.now() - 4500000,
    isOnline: false,
  },
  {
    id: 'bin-6',
    name: 'Bin 6 - Mall Road',
    location: { latitude: 31.49, longitude: 74.32 },
    fillLevel: 88,
    status: 'full',
    zone: 'Liberty',
    lastUpdate: Date.now() - 1200000,
    isOnline: true,
  },
  {
    id: 'bin-7',
    name: 'Bin 7 - Fortress Stadium',
    location: { latitude: 31.5, longitude: 74.35 },
    fillLevel: 92,
    status: 'overflow',
    zone: 'Cantonment',
    lastUpdate: Date.now() - 600000,
    isOnline: true,
  },
  {
    id: 'bin-8',
    name: 'Bin 8 - Model Town',
    location: { latitude: 31.47, longitude: 74.35 },
    fillLevel: 75,
    status: 'full',
    zone: 'Model Town',
    lastUpdate: Date.now() - 1800000,
    isOnline: true,
  },
  {
    id: 'bin-9',
    name: 'Bin 9 - Gulberg',
    location: { latitude: 31.52, longitude: 74.34 },
    fillLevel: 85,
    status: 'full',
    zone: 'Gulberg',
    lastUpdate: Date.now() - 900000,
    isOnline: true,
  },
  {
    id: 'bin-10',
    name: 'Bin 10 - DHA',
    location: { latitude: 31.46, longitude: 74.37 },
    fillLevel: 65,
    status: 'filling',
    zone: 'DHA',
    lastUpdate: Date.now() - 2400000,
    isOnline: true,
  },
];

export const WorkerMapScreen: React.FC = () => {
  const { user, userData } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const mapRef = useRef<MapView>(null);
  const [assignedBins, setAssignedBins] = useState<Bin[]>([]);

  const workerId = user?.uid || userData?.id || null;

  useEffect(() => {
    if (!workerId) return;

    const unsubscribe = binService.subscribeToBins((binsData) => {
      const byId = new Map<string, Bin>();
      fallbackBins.forEach((b) => byId.set(b.id, b));
      binsData.forEach((b) => byId.set(b.id, { ...byId.get(b.id), ...b, id: b.id } as Bin));

      const merged = Array.from(byId.values());
      const workerBins = merged.filter(
        (bin: any) =>
          bin.assignedWorkerId === workerId &&
          bin.location &&
          typeof bin.location.latitude === 'number' &&
          typeof bin.location.longitude === 'number'
      );

      setAssignedBins(workerBins);
    });

    return () => unsubscribe();
  }, [workerId]);

  const coordinates = useMemo(
    () =>
      assignedBins.map((bin) => ({
        latitude: bin.location.latitude,
        longitude: bin.location.longitude,
      })),
    [assignedBins]
  );

  useEffect(() => {
    if (!mapRef.current) return;

    if (coordinates.length === 0) {
      mapRef.current.animateToRegion(DEFAULT_REGION, 400);
      return;
    }

    mapRef.current.fitToCoordinates(coordinates, {
      animated: true,
      edgePadding: { top: 80, right: 60, bottom: 160, left: 60 },
    });
  }, [coordinates]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Assigned Bins Map</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsCompass
        showsUserLocation
        showsMyLocationButton={false}
      >
        {assignedBins.map((bin) => {
          const statusColor = bin.status === 'full' ? '#DC2626' : bin.status === 'filling' ? '#F59E0B' : '#059669';
          return (
            <Marker
              key={bin.id}
              coordinate={{ latitude: bin.location.latitude, longitude: bin.location.longitude }}
              title={bin.name || bin.id}
              description={`${bin.zone ?? ''}  •  ${bin.fillLevel ?? 0}%`}
            >
              <View style={[styles.markerContainer, { backgroundColor: statusColor }]}>
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.bottomCard}>
        <Text style={styles.bottomTitle}>Tasks on map</Text>
        <Text style={styles.bottomSubtitle}>{assignedBins.length} bins assigned to you</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  bottomCard: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bottomTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bottomSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
