import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Bin } from '../../types';
import { theme } from '../../utils/theme';

interface QRCodeGeneratorScreenProps {
  route?: {
    params?: {
      bin?: Bin;
    };
  };
}

export const QRCodeGeneratorScreen: React.FC<QRCodeGeneratorScreenProps> = ({ route }) => {
  const [selectedBin, setSelectedBin] = useState<Bin | null>(route?.params?.bin || null);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrCodeRef = React.useRef<View>(null);

  const { width } = Dimensions.get('window');

  // Mock bins data with proper names and IDs
  const mockBins: Bin[] = [
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
      name: 'Bin 5 - Ghalib Road',
      location: { latitude: 31.5070, longitude: 74.3410 },
      fillLevel: 52,
      status: 'filling',
      zone: 'Gulberg III',
      lastUpdate: Date.now(),
      isOnline: true,
      dumpCount: 14,
      lastDumpAt: Date.now() - 18000000,
    },
  ];

  const generateQRData = (bin: Bin) => {
    return JSON.stringify({
      type: 'smart_bin',
      binId: bin.id,
      name: bin.name,
      location: bin.location,
      timestamp: Date.now(),
    });
  };

  const downloadQRCode = async (bin: Bin) => {
    try {
      setIsDownloading(true);
      
      if (!qrCodeRef.current) {
        throw new Error('QR Code reference not found');
      }

      // Capture the QR code as an image
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1,
      });

      // Create a unique filename
      const fileName = `${bin.name.replace(/\s+/g, '_')}_QR_${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Move the captured image to documents
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Share the downloaded file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: `Save QR Code for ${bin.name}`,
        });
      } else {
        Alert.alert('Success', `QR Code saved to: ${fileUri}`);
      }

    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download QR code. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAllQRCodesAsPDF = async () => {
    try {
      setIsDownloading(true);
      
      // Create a formatted text file with all QR codes info (simulating PDF)
      const content = mockBins.map(bin => {
        const qrData = generateQRData(bin);
        return `=== ${bin.name} ===\n` +
          `Bin ID: ${bin.id}\n` +
          `Location: ${bin.location.latitude}, ${bin.location.longitude}\n` +
          `Status: ${bin.status}\n` +
          `Zone: ${bin.zone}\n` +
          `QR Data: ${qrData}\n\n` +
          `[QR Code would be printed here in actual PDF]\n\n`;
      }).join('');

      const fileName = `All_Bin_QR_Codes_${Date.now()}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: 'utf8',
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Share All Bin QR Codes (PDF Format)',
        });
      } else {
        Alert.alert('Success', `All QR codes saved to: ${fileUri}`);
      }

    } catch (error) {
      console.error('Download all error:', error);
      Alert.alert('Error', 'Failed to download all QR codes. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareQR = async (bin: Bin) => {
    try {
      const qrData = generateQRData(bin);
      await Share.share({
        message: `Smart Waste Management Bin QR Code\n\nBin: ${bin.name}\nID: ${bin.id}\nLocation: ${bin.location.latitude.toFixed(4)}, ${bin.location.longitude.toFixed(4)}\n\nQR Data: ${qrData}`,
        title: `QR Code for ${bin.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handlePrintQR = (bin: Bin) => {
    Alert.alert(
      'Print QR Code',
      `Ready to print QR code for ${bin.name}.\n\nDownload the QR code image and print it on weather-resistant material.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download for Printing', 
          onPress: () => downloadQRCode(bin) 
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return '#10B981';
      case 'filling': return '#F59E0B';
      case 'full': return '#EF4444';
      case 'overflow': return '#DC2626';
      default: return '#6B7280';
    }
  };

  if (selectedBin) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedBin(null)}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Code - {selectedBin.name}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* QR Code Display */}
          <Card style={styles.qrCard}>
            <Card.Content style={styles.qrCardContent}>
              <Text style={styles.qrTitle}>Scan This QR Code</Text>
              <Text style={styles.qrSubtitle}>Citizens can scan this to update bin status</Text>
              
              <View style={styles.qrCodeContainer} ref={qrCodeRef}>
                <View style={styles.qrCodeInner}>
                  <QRCode
                    value={generateQRData(selectedBin)}
                    size={200}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                    logoSize={30}
                    logoBackgroundColor="#10B981"
                  />
                </View>
                <Text style={styles.qrCodeLabel}>{selectedBin.name}</Text>
                <Text style={styles.qrCodeId}>ID: {selectedBin.id}</Text>
              </View>

              <View style={styles.binInfo}>
                <Text style={styles.binName}>{selectedBin.name}</Text>
                <Text style={styles.binId}>ID: {selectedBin.id}</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusText}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedBin.status) }]}>
                    <Text style={styles.statusBadgeText}>{selectedBin.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.locationText}>
                  📍 {selectedBin.location.latitude.toFixed(4)}, {selectedBin.location.longitude.toFixed(4)}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  mode="contained"
                  onPress={() => downloadQRCode(selectedBin)}
                  style={styles.downloadButton}
                  icon="download"
                  loading={isDownloading}
                  disabled={isDownloading}
                >
                  {isDownloading ? 'Downloading...' : 'Download'}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleShareQR(selectedBin)}
                  style={styles.shareButton}
                  icon="share"
                >
                  Share
                </Button>
              </View>
            </Card.Content>
          </Card>

          {/* Instructions */}
          <Card style={styles.instructionsCard}>
            <Card.Content>
              <Text style={styles.instructionsTitle}>How to Use This QR Code</Text>
              <View style={styles.instructionList}>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.instructionText}>Print and attach to physical bin</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.instructionText}>Citizens scan with "Scan Bin" feature</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.instructionText}>Automatically updates bin fill level</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.instructionText}>Tracks waste management analytics</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate Bin QR Codes</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Select a bin to generate its QR code. Each bin gets a unique QR code that citizens can scan to report waste levels.
        </Text>

        {/* Download All Button */}
        <Card style={styles.downloadAllCard}>
          <Card.Content>
            <Text style={styles.downloadAllTitle}>Download All QR Codes as PDF</Text>
            <Text style={styles.downloadAllDescription}>
              Get all bin QR codes information in a single file for bulk printing. This will create a formatted document suitable for printing.
            </Text>
            <Button
              mode="contained"
              onPress={downloadAllQRCodesAsPDF}
              style={styles.downloadAllButton}
              icon="file-pdf"
              loading={isDownloading}
              disabled={isDownloading}
            >
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          </Card.Content>
        </Card>

        {mockBins.map((bin) => (
          <Card key={bin.id} style={styles.binCard}>
            <Card.Content>
              <View style={styles.binRow}>
                <View style={styles.binDetails}>
                  <Text style={styles.binName}>{bin.name}</Text>
                  <Text style={styles.binId}>ID: {bin.id}</Text>
                  <View style={styles.binStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Fill Level</Text>
                      <Text style={styles.statValue}>{bin.fillLevel}%</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bin.status) }]}>
                      <Text style={styles.statusBadgeText}>{bin.status.toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.binActions}>
                  <IconButton
                    icon="qrcode"
                    size={24}
                    iconColor={theme.colors.primary}
                    onPress={() => setSelectedBin(bin)}
                  />
                  <IconButton
                    icon="download"
                    size={24}
                    iconColor={theme.colors.primary}
                    onPress={() => downloadQRCode(bin)}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  binCard: {
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },
  binRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  binDetails: {
    flex: 1,
  },
  binName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  binId: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  binStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  binActions: {
    flexDirection: 'row',
  },
  qrCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 20,
  },
  qrCardContent: {
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  qrCodeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrCodeInner: {
    marginBottom: 16,
  },
  qrCodeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  qrCodeId: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  binInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  downloadAllCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  downloadAllTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  downloadAllDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  downloadAllButton: {
    backgroundColor: theme.colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  shareButton: {
    flex: 1,
  },
  instructionsCard: {
    backgroundColor: theme.colors.surface,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  instructionList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
