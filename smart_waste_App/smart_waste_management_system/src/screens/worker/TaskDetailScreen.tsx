import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Modal, TouchableOpacity } from 'react-native';
import { Card, Text, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraView, BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { binService } from '../../services/binService';
import { Bin, WorkerStackParamList } from '../../types';
import { theme } from '../../utils/theme';

type RouteParams = {
  taskId: string;
};

type NavigationProp = StackNavigationProp<WorkerStackParamList>;

const extractBinId = (raw: string): string | null => {
  const trimmed = (raw ?? '').trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed?.type === 'smart_bin' && parsed?.binId) {
      return String(parsed.binId);
    }
  } catch {
    // ignore
  }

  const queryMatch = trimmed.match(/[?&]binId=([^&]+)/i);
  if (queryMatch?.[1]) return decodeURIComponent(queryMatch[1]);

  const binPrefixMatch = trimmed.match(/^bin[:/](.+)$/i);
  if (binPrefixMatch?.[1]) return binPrefixMatch[1].trim();

  const lastSegmentMatch = trimmed.match(/([A-Za-z0-9_-]{6,})\/?$/);
  if (lastSegmentMatch?.[1]) return lastSegmentMatch[1];

  return trimmed || null;
};

export const TaskDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const { taskId } = route.params as RouteParams;
  const [bin, setBin] = useState<Bin | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emptying, setEmptying] = useState(false);

  useEffect(() => {
    const loadBin = async () => {
      const binData = await binService.getBin(taskId);
      setBin(binData);
      setLoading(false);
    };

    loadBin();
  }, [taskId]);

  const handleStartScanning = () => {
    setScanning(true);
    setScanned(false);
  };

  const onBarcodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      if (!bin) return;
      if (scanned || isProcessing) return;

      setScanned(true);
      setIsProcessing(true);

      try {
        const scannedBinId = extractBinId(result.data);
        if (!scannedBinId) {
          throw new Error('Invalid QR code');
        }

        if (String(scannedBinId) !== String(bin.id)) {
          Alert.alert('Wrong bin', 'This QR code does not match the selected bin. Please scan the correct bin QR.');
          setScanned(false);
          return;
        }

        setScanning(false);
        await emptyBin();
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Failed to scan QR');
        setScanned(false);
      } finally {
        setIsProcessing(false);
      }
    },
    [bin, isProcessing, scanned]
  );

  const emptyBin = async () => {
    if (!bin) return;
    
    setEmptying(true);
    try {
      // Update bin status to empty
      await binService.updateBin(bin.id, {
        fillLevel: 0,
        status: 'empty',
        lastUpdate: Date.now(),
        dumpCount: (bin.dumpCount || 0) + 1,
        lastDumpAt: Date.now(),
      });

      Alert.alert(
        '✅ Task Completed!',
        `Bin ${bin.name || bin.id} has been successfully emptied.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      console.error('Failed to empty bin:', error);
      Alert.alert(
        'Error',
        'Failed to update bin status. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setEmptying(false);
    }
  };

  const handleGetDirections = () => {
    if (!bin) return;

    if (!bin.location || typeof bin.location.latitude !== 'number' || typeof bin.location.longitude !== 'number') {
      Alert.alert('Error', 'Location unavailable for this bin');
      return;
    }
    
    const { latitude, longitude } = bin.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Google Maps');
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Loading bin details...</Text>
      </View>
    );
  }

  if (!bin) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Bin not found</Text>
      </View>
    );
  }

  if (scanning) {
    const permissionGranted = permission?.granted === true;

    const content = permissionGranted ? (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
        />

        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topBarButton}
              activeOpacity={0.8}
              onPress={() => {
                setScanning(false);
                setScanned(false);
                setIsProcessing(false);
              }}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.frameContainer} pointerEvents="none">
            <View style={styles.frame} />
            <Text style={styles.instructions}>Align the QR code inside the frame</Text>
          </View>

          <View style={styles.bottomBar} pointerEvents="box-none">
            {isProcessing ? (
              <View style={styles.processingPill}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.processingText}>Verifying…</Text>
              </View>
            ) : scanned ? (
              <TouchableOpacity
                style={styles.rescanButton}
                activeOpacity={0.8}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.rescanText}>Tap to scan again</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.hintText}>Scanning…</Text>
            )}
          </View>
        </View>
      </View>
    ) : (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={56} color="#059669" />
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionSubtitle}>Allow camera access to scan the bin QR code.</Text>
        <Button mode="contained" onPress={() => requestPermission()} style={styles.permissionButton}>
          Grant Permission
        </Button>
        <Button
          mode="text"
          onPress={() => {
            setScanning(false);
            setScanned(false);
            setIsProcessing(false);
          }}
        >
          Cancel
        </Button>
      </View>
    );

    return (
      <Modal visible={scanning} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.scannerContainer}>{content}</View>
      </Modal>
    );
  }

  const getStatusColor = (status: Bin['status']) => {
    switch (status) {
      case 'empty': return '#10B981';
      case 'filling': return '#F59E0B';
      case 'full': return '#EF4444';
      case 'overflow': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getPriorityLevel = (fillLevel: number) => {
    if (fillLevel >= 90) return { text: 'URGENT', color: '#DC2626' };
    if (fillLevel >= 75) return { text: 'High', color: '#EF4444' };
    if (fillLevel >= 50) return { text: 'Medium', color: '#F59E0B' };
    return { text: 'Low', color: '#10B981' };
  };

  const priority = getPriorityLevel(bin.fillLevel);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(bin.status) }]} />
              <View>
                <Text style={styles.title}>{bin.name || `Bin ${bin.id}`}</Text>
                <Text style={styles.subtitle}>{bin.zone}</Text>
              </View>
            </View>
            <View style={styles.fillLevelContainer}>
              <Text style={styles.fillLevelText}>{bin.fillLevel}%</Text>
              <Text style={styles.statusText}>{bin.status}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#64748B" />
            <Text style={styles.infoText}>
              {bin.location?.latitude?.toFixed?.(6) ?? 'N/A'}, {bin.location?.longitude?.toFixed?.(6) ?? 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#64748B" />
            <Text style={styles.infoText}>
              Last updated: {new Date(bin.lastUpdate).toLocaleString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="trash-outline" size={20} color="#64748B" />
            <Text style={styles.infoText}>
              Dump count: {bin.dumpCount || 0}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Priority & Status</Text>
          <View style={styles.chipContainer}>
            <View style={[styles.chip, { backgroundColor: priority.color + '20' }]}>
              <Text style={[styles.chipText, { color: priority.color }]}>
                {priority.text} Priority
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: getStatusColor(bin.status) + '20' }]}>
              <Text style={[styles.chipText, { color: getStatusColor(bin.status) }]}>
                {String(bin.status ?? 'unknown').toUpperCase()}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handleGetDirections}
          style={styles.directionsButton}
          icon="map-outline"
          contentStyle={styles.buttonContent}
        >
          Get Directions
        </Button>
        
        <Button
          mode="contained"
          onPress={handleStartScanning}
          style={styles.scanButton}
          icon="qr-code-outline"
          loading={emptying}
          disabled={emptying}
          contentStyle={styles.buttonContent}
        >
          {emptying ? 'Emptying...' : 'Empty Bin (Scan QR)'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: theme.spacing.md,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  fillLevelContainer: {
    alignItems: 'flex-end',
  },
  fillLevelText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  directionsButton: {
    borderColor: '#059669',
  },
  scanButton: {
    backgroundColor: '#059669',
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  instructions: {
    marginTop: theme.spacing.md,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bottomBar: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rescanButton: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  rescanText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  processingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  permissionButton: {
    backgroundColor: '#059669',
    alignSelf: 'stretch',
  },
});

