import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { taskService } from '../../services/taskService';
import { binService } from '../../services/binService';
import { Task, Bin } from '../../types';
import { BIN_STATUS_COLORS } from '../../utils/constants';
import { Text } from 'react-native-paper';

type RouteParams = {
  taskId: string;
};

export const RouteScreen: React.FC = () => {
  const route = useRoute();
  const { taskId } = route.params as RouteParams;
  const [task, setTask] = useState<Task | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const taskData = await taskService.getTask(taskId);
      setTask(taskData);

      if (taskData) {
        const binsData = await Promise.all(
          taskData.binIds.map((binId) => binService.getBin(binId))
        );
        const validBins = (binsData.filter((bin) => bin !== null) as Bin[]).filter(
          (bin) =>
            !!bin.location &&
            typeof bin.location.latitude === 'number' &&
            typeof bin.location.longitude === 'number'
        );
        setBins(validBins);
      }

      setLoading(false);
    };

    loadData();
  }, [taskId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading route...</Text>
      </View>
    );
  }

  if (!task || bins.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No route data available</Text>
      </View>
    );
  }

  // Calculate map region to show all bins
  const latitudes = bins.map((bin) => bin.location.latitude);
  const longitudes = bins.map((bin) => bin.location.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const region = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.01),
  };

  // Create route coordinates
  const routeCoordinates = bins.map((bin) => ({
    latitude: bin.location.latitude,
    longitude: bin.location.longitude,
  }));

  return (
    <View style={styles.container}>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} initialRegion={region}>
        {bins.map((bin, index) => (
          <Marker
            key={bin.id}
            coordinate={{
              latitude: bin.location.latitude,
              longitude: bin.location.longitude,
            }}
            title={`${index + 1}. ${bin.name || `Bin ${bin.id}`}`}
            description={`${bin.fillLevel}% full`}
            pinColor={BIN_STATUS_COLORS[bin.status]}
          />
        ))}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2196F3"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
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
  },
});

