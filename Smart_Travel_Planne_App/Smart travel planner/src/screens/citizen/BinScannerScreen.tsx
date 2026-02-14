import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../utils/theme';
import { binService } from '../../services/binService';

const extractBinId = (raw: string): string | null => {
  const trimmed = (raw ?? '').trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed.type === 'smart_bin' && parsed.binId) {
      return parsed.binId;
    }
  } catch {
    // Not JSON, continue with other methods
  }

  // Legacy methods for backward compatibility
  const queryMatch = trimmed.match(/[?&]binId=([^&]+)/i);
  if (queryMatch?.[1]) return decodeURIComponent(queryMatch[1]);

  const binPrefixMatch = trimmed.match(/^bin[:/](.+)$/i);
  if (binPrefixMatch?.[1]) return binPrefixMatch[1].trim();

  const lastSegmentMatch = trimmed.match(/([A-Za-z0-9_-]{6,})\/?$/);
  if (lastSegmentMatch?.[1]) return lastSegmentMatch[1];

  return trimmed;
};

export const BinScannerScreen: React.FC = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const permissionGranted = permission?.granted === true;

  const onBarcodeScanned = useCallback(
    async (result: BarcodeScanningResult) => {
      if (scanned || isProcessing) return;

      setScanned(true);
      setIsProcessing(true);

      try {
        const raw = (result.data ?? '').trim();
        let parsed: any = null;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }

        const binId = extractBinId(raw);
        if (!binId) {
          throw new Error('Invalid QR code');
        }

        if (parsed?.type === 'smart_bin' && parsed?.binId) {
          const location = parsed?.location;
          if (location && typeof location.latitude === 'number' && typeof location.longitude === 'number') {
            await binService.updateBin(binId, {
              name: parsed?.name,
              location,
              isOnline: true,
              lastUpdate: Date.now(),
            } as any);
          }
        }

        await binService.incrementBinFillLevel(binId, 10);

        Alert.alert('Success', 'Bin updated successfully. Thank you for helping keep the city clean.', [
          {
            text: 'Done',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Failed to update bin');
        setScanned(false);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, navigation, scanned]
  );

  const content = useMemo(() => {
    if (!permission) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (!permissionGranted) {
      return (
        <View style={styles.centered}>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionSubtitle}>
            Allow camera access to scan the bin QR code and update its fill level.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            activeOpacity={0.8}
            onPress={() => {
              requestPermission();
            }}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
        />

        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.topBar}>
            <IconButton
              icon="arrow-left"
              size={22}
              iconColor="#FFFFFF"
              style={styles.topBarButton}
              onPress={() => navigation.goBack()}
            />
          </View>

          <View style={styles.frameContainer} pointerEvents="none">
            <View style={styles.frame} />
            <Text style={styles.instructions}>Align the QR code inside the frame</Text>
          </View>

          <View style={styles.bottomBar} pointerEvents="box-none">
            {isProcessing ? (
              <View style={styles.processingPill}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.processingText}>Updating bin…</Text>
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
    );
  }, [isProcessing, navigation, onBarcodeScanned, permission, permissionGranted, requestPermission, scanned]);

  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  permissionSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarButton: {
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  frameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: theme.borderRadius.lg,
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
    borderRadius: theme.borderRadius.md,
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
    borderRadius: theme.borderRadius.md,
  },
  rescanButton: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
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
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
