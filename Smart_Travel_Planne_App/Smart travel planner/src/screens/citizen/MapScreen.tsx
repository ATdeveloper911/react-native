import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { IconButton, Text, Card, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BinIcon } from '../../components/BinIcon';
import { binService } from '../../services/binService';
import { Bin, BinStatus } from '../../types';
import { BIN_STATUS_COLORS, BIN_STATUS_LABELS, getZoneRegion } from '../../utils/constants';
import { theme } from '../../utils/theme';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// Predefined bins (fallback) – keep in sync with admin dashboard/bin management mock bins
const PREDEFINED_BINS: Bin[] = [
  {
    id: 'bin-1',
    name: 'Bin 1 - Liberty Market',
    location: { latitude: 31.5105, longitude: 74.3440 },
    fillLevel: 35,
    status: 'filling',
    zone: 'Gulberg III',
    lastUpdate: Date.now(),
    isOnline: true,
    dumpCount: 12,
    lastDumpAt: Date.now() - 86400000,
  },
  {
    id: 'bin-2',
    name: 'Bin 2 - MM Alam Road',
    location: { latitude: 31.5090, longitude: 74.3465 },
    fillLevel: 72,
    status: 'full',
    zone: 'Gulberg III',
    lastUpdate: Date.now(),
    isOnline: true,
    dumpCount: 18,
    lastDumpAt: Date.now() - 43200000,
  },
  {
    id: 'bin-3',
    name: 'Bin 3 - Main Boulevard',
    location: { latitude: 31.5125, longitude: 74.3420 },
    fillLevel: 15,
    status: 'empty',
    zone: 'Gulberg III',
    lastUpdate: Date.now(),
    isOnline: true,
    dumpCount: 8,
    lastDumpAt: Date.now() - 3600000,
  },
  {
    id: 'bin-4',
    name: 'Bin 4 - Mini Market',
    location: { latitude: 31.5140, longitude: 74.3480 },
    fillLevel: 88,
    status: 'overflow',
    zone: 'Gulberg III',
    lastUpdate: Date.now(),
    isOnline: true,
    dumpCount: 25,
    lastDumpAt: Date.now() - 72000000,
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

// Residential population points (houses)
const RESIDENTIAL_POINTS = [
  { id: 'house1', latitude: 31.5110, longitude: 74.3435 },
  { id: 'house2', latitude: 31.5095, longitude: 74.3450 },
  { id: 'house3', latitude: 31.5130, longitude: 74.3430 },
  { id: 'house4', latitude: 31.5085, longitude: 74.3425 },
  { id: 'house5', latitude: 31.5115, longitude: 74.3470 },
  { id: 'house6', latitude: 31.5100, longitude: 74.3490 },
  { id: 'house7', latitude: 31.5150, longitude: 74.3455 },
  { id: 'house8', latitude: 31.5065, longitude: 74.3445 },
  { id: 'house9', latitude: 31.5120, longitude: 74.3400 },
  { id: 'house10', latitude: 31.5080, longitude: 74.3475 },
];

// Silver/Minimalist map style JSON
const SILVER_MAP_STYLE = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.medical',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.school',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.sports_complex',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.government',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.place_of_worship',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.attraction',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e9e9e9' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0e0e0' }],
  },
];

export const MapScreen: React.FC = () => {
  const { userData } = useAuth();
  const [bins, setBins] = useState<Bin[]>(PREDEFINED_BINS);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<BinStatus | 'all'>('all');
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const selectedBin = selectedBinId ? bins.find((b) => b.id === selectedBinId) ?? null : null;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const mapRef = useRef<MapView>(null);
  const zoneRegion = getZoneRegion(userData?.zone);

  useEffect(() => {
    // Request location permission and get current location
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (error: any) {
        console.warn('Location permission denied or error:', error.message);
      }
    })();

    // Subscribe to bins (real-time). Merge into fallback so the map doesn't shrink
    // when the database contains fewer bins than the predefined set.
    const unsubscribe = binService.subscribeToBins((binsData) => {
      if (!binsData || binsData.length === 0) return;

      setBins((prev) => {
        const base = prev && prev.length > 0 ? prev : PREDEFINED_BINS;
        const byId = new Map<string, Bin>();

        base.forEach((b) => byId.set(b.id, b));
        binsData.forEach((b) => byId.set(b.id, { ...byId.get(b.id), ...b } as Bin));

        return Array.from(byId.values());
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (zoneRegion && mapRef.current) {
      mapRef.current.animateToRegion(zoneRegion);
    }
  }, [zoneRegion]);

  useEffect(() => {
    if (selectedBinId) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedBinId]);

  const getMarkerColor = (status: BinStatus): string => {
    return BIN_STATUS_COLORS[status] || BIN_STATUS_COLORS.offline;
  };

  const zoneFilteredBins = bins.filter((bin) => {
    if (!userData?.zone) return true;
    const anyBinsHaveZone = bins.some((b) => !!b.zone);
    if (!anyBinsHaveZone) return true;
    return bin.zone === userData.zone;
  });

  const filteredBins = zoneFilteredBins.filter((bin) => {
    if (selectedFilter === 'all') return true;
    return bin.status === selectedFilter;
  });

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: 31.5111,
    longitude: 74.3453,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={!!userLocation}
          showsMyLocationButton={false}
          showsCompass={true}
          toolbarEnabled={false}
          customMapStyle={SILVER_MAP_STYLE}
        >
          {/* Residential Population Icons */}
          {RESIDENTIAL_POINTS.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
            >
              <View style={styles.populationIcon}>
                <MaterialCommunityIcons name="account-group" size={16} color="#757575" />
              </View>
            </Marker>
          ))}

          {/* Bin Markers */}
          {filteredBins.map((bin) => (
            <Marker
              key={bin.id}
              coordinate={{
                latitude: bin.location.latitude,
                longitude: bin.location.longitude,
              }}
              onPress={() => setSelectedBinId(bin.id)}
            >
              <View style={styles.binMarkerContainer}>
                <BinIcon 
                  size={32} 
                  fillLevel={bin.fillLevel}
                  color={getMarkerColor(bin.status)}
                />
              </View>
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{bin.name || `Bin ${bin.id}`}</Text>
                  <Text style={styles.calloutText}>
                    {BIN_STATUS_LABELS[bin.status]} - {bin.fillLevel}% full
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {/* Filter Bar */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {['all', 'empty', 'filling', 'full', 'overflow'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterChip,
                  selectedFilter === status && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(status as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.filterDot,
                    {
                      backgroundColor:
                        status === 'all'
                          ? theme.colors.textSecondary
                          : BIN_STATUS_COLORS[status as BinStatus],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === status && styles.filterTextActive,
                  ]}
                >
                  {status === 'all' ? 'All' : BIN_STATUS_LABELS[status as BinStatus]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={centerOnUser} activeOpacity={0.7}>
            <LinearGradient
              colors={['#4CAF50', '#81C784']}
              style={styles.controlGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconButton icon="crosshairs-gps" size={24} iconColor="#FFFFFF" style={styles.controlIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bin Detail Card */}
        {selectedBin && (
          <Animated.View
            style={[
              styles.binDetailCard,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.binHeader}>
                  <View style={styles.binTitleContainer}>
                    <Text style={styles.binTitle}>
                      {selectedBin.name || `Bin ${selectedBin.id}`}
                    </Text>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: getMarkerColor(selectedBin.status) + '20' },
                      ]}
                      textStyle={{ color: getMarkerColor(selectedBin.status) }}
                    >
                      {BIN_STATUS_LABELS[selectedBin.status]}
                    </Chip>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedBinId(null)}>
                    <IconButton icon="close" size={24} iconColor={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.binDetails}>
                  <View style={styles.detailRow}>
                    <IconButton
                      icon="percent"
                      size={20}
                      iconColor={theme.colors.textSecondary}
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>Fill Level: {selectedBin.fillLevel}%</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <IconButton
                      icon="map-marker"
                      size={20}
                      iconColor={theme.colors.textSecondary}
                      style={styles.detailIcon}
                    />
                    <Text style={styles.detailText}>
                      {selectedBin.location.latitude.toFixed(4)},{' '}
                      {selectedBin.location.longitude.toFixed(4)}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {locationError && (
          <View style={styles.errorContainer}>
            <Card style={styles.errorCard}>
              <Card.Content>
                <View style={styles.errorContent}>
                  <IconButton icon="alert-circle" size={24} iconColor={theme.colors.error} />
                  <Text style={styles.errorText}>{locationError}</Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  filterContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 16,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.md,
  },
  filterScroll: {
    gap: theme.spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    marginRight: theme.spacing.sm,
    ...theme.shadows.md,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primaryContainer + '20',
    borderColor: theme.colors.primary,
  },
  filterDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  filterTextActive: {
    color: theme.colors.primary,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 120,
    right: theme.spacing.md,
  },
  controlButton: {
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  controlGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    margin: 0,
  },
  binDetailCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
  },
  card: {
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.lg,
  },
  binHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  binTitleContainer: {
    flex: 1,
  },
  binTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  binDetails: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    margin: 0,
    marginLeft: -theme.spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  calloutContainer: {
    width: 150,
    padding: theme.spacing.xs,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  calloutText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 80,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  errorCard: {
    backgroundColor: theme.colors.error,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: theme.spacing.xs,
  },
  populationIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  binMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
