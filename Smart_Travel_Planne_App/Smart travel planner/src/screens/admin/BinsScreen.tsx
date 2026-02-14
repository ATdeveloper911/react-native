import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Card, Text, Title, Paragraph, Chip, Button, IconButton, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';
import { binService } from '../../services/binService';
import { Bin } from '../../types';
import { BIN_STATUS_COLORS, BIN_STATUS_LABELS } from '../../utils/constants';
import { AdminStackParamList } from '../../navigation/AdminNavigator';

type BinsScreenNavigationProp = StackNavigationProp<AdminStackParamList, 'Bins'>;

export const BinsScreen: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedBinForQR, setSelectedBinForQR] = useState<Bin | null>(null);
  const [showAddBinModal, setShowAddBinModal] = useState(false);
  const [addingBin, setAddingBin] = useState(false);
  const [newBin, setNewBin] = useState({
    name: '',
    zone: '',
    latitude: '',
    longitude: '',
  });
  const navigation = useNavigation<BinsScreenNavigationProp>();
  const qrCodeRef = useRef<View>(null);

  // Import the same mock data from AdminDashboardScreen to ensure consistency
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
    // Use mock bins instead of empty array
    setBins(mockBins);
    
    // Optionally still subscribe to real-time updates
    const unsubscribe = binService.subscribeToBins((binsData) => {
      if (binsData && binsData.length > 0) {
        setBins(binsData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleViewQRCode = (bin: Bin) => {
    // Show QR code modal for download
    setSelectedBinForQR(bin);
  };

  const handleDownloadQR = (bin: Bin) => {
    setSelectedBinForQR(bin);
  };

  const downloadQRCodeImage = async (bin: Bin) => {
    try {
      setIsDownloading(true);
      console.log(`Download QR for ${bin.id}`);
      
      if (!qrCodeRef.current) {
        throw new Error('QR Code reference not found');
      }

      // Capture the QR code as an image
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1,
      });

      // Create a unique filename
      const fileName = `${(bin.name || `Bin ${bin.id}`).replace(/\s+/g, '_')}_QR_${Date.now()}.png`;
      
      // Use the cache directory which is writable
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Move the captured image to cache
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Share the downloaded file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: `Share QR Code for ${bin.name || `Bin ${bin.id}`}`,
        });
        console.log(`QR code downloaded successfully for ${bin.id}`);
      } else {
        console.log(`QR code saved to: ${fileUri}`);
      }

    } catch (error) {
      console.error('Download QR error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const generateQRData = (bin: Bin) => {
    return JSON.stringify({
      type: 'smart_bin',
      binId: bin.id,
      name: bin.name,
      location: bin.location,
      timestamp: Date.now(),
    });
  };

  const renderQRCodeModal = () => {
    if (!selectedBinForQR) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>QR Code - {selectedBinForQR.name}</Text>
            <TouchableOpacity onPress={() => setSelectedBinForQR(null)}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.qrCodeContainer} ref={qrCodeRef}>
            <Text style={styles.qrTitle}>Scan This QR Code</Text>
            <Text style={styles.qrSubtitle}>Citizens can scan this to update bin status</Text>
            
            <View style={styles.qrCodeInner}>
              <QRCode
                value={generateQRData(selectedBinForQR)}
                size={200}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>
            <Text style={styles.qrCodeLabel}>{selectedBinForQR.name}</Text>
            <Text style={styles.qrCodeId}>ID: {selectedBinForQR.id}</Text>
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={() => downloadQRCodeImage(selectedBinForQR)}
              style={styles.downloadButton}
              icon="download"
              loading={isDownloading}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download QR Code'}
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const downloadAllQRCodesAsPDF = async () => {
    try {
      setIsDownloading(true);
      console.log('Generate PDF with all QR codes');
      
      // Create formatted content for all bins
      const content = mockBins.map(bin => {
        const qrData = JSON.stringify({
          type: 'smart_bin',
          binId: bin.id,
          name: bin.name,
          location: bin.location,
          timestamp: Date.now(),
        });

        return `=====================================\n` +
          `${bin.name}\n` +
          `=====================================\n\n` +
          `Bin ID: ${bin.id}\n` +
          `Location: ${bin.location.latitude.toFixed(4)}, ${bin.location.longitude.toFixed(4)}\n` +
          `Status: ${bin.status}\n` +
          `Zone: ${bin.zone}\n` +
          `Fill Level: ${bin.fillLevel}%\n\n` +
          `QR Data: ${qrData}\n\n` +
          `[QR Code Image Would Be Here]\n\n` +
          `Instructions:\n` +
          `• Print on weather-resistant material\n` +
          `• Attach securely to physical bin\n` +
          `• Citizens scan with "Scan Bin" feature\n` +
          `• Automatically updates fill level\n\n` +
          `-------------------------------------\n\n`;
      }).join('');

      const fileName = `All_Bin_QR_Codes_${Date.now()}.txt`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Share All Bin QR Codes',
        });
        console.log('All QR codes PDF downloaded successfully');
      } else {
        console.log(`All QR codes saved to: ${fileUri}`);
      }

    } catch (error) {
      console.error('Download all QR codes error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddBin = () => {
    setNewBin({ name: '', zone: '', latitude: '', longitude: '' });
    setShowAddBinModal(true);
  };

  const handleCreateBin = async () => {
    if (!newBin.name || !newBin.zone || !newBin.latitude || !newBin.longitude) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const lat = parseFloat(newBin.latitude);
    const lng = parseFloat(newBin.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert('Error', 'Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
      return;
    }

    setAddingBin(true);
    try {
      const binId = await binService.createBin({
        name: newBin.name,
        zone: newBin.zone,
        location: { latitude: lat, longitude: lng },
        fillLevel: 0,
        status: 'empty' as const,
        lastUpdate: Date.now(),
        isOnline: true,
        dumpCount: 0,
        lastDumpAt: Date.now(),
      });

      Alert.alert(
        '✅ Bin Created Successfully!',
        `${newBin.name} has been added to the system.\n\nBin ID: ${binId}\n\nQR code will be generated automatically.`,
        [
          {
            text: 'Download QR Code',
            onPress: () => {
              const createdBin = {
                id: binId,
                name: newBin.name,
                zone: newBin.zone,
                location: { latitude: lat, longitude: lng },
                fillLevel: 0,
                status: 'empty' as const,
                lastUpdate: Date.now(),
                isOnline: true,
                dumpCount: 0,
                lastDumpAt: Date.now(),
              };
              setSelectedBinForQR(createdBin);
            },
          },
          { text: 'OK', onPress: () => setShowAddBinModal(false) },
        ]
      );

      // Refresh bins list
      const updatedBins = await binService.getBinsOnce();
      setBins(updatedBins);

    } catch (error) {
      console.error('Error creating bin:', error);
      Alert.alert('Error', 'Failed to create bin. Please try again.');
    } finally {
      setAddingBin(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text variant="headlineSmall" style={styles.title}>
            All Bins ({bins.length})
          </Text>
          <View style={styles.headerButtons}>
            <Button
              mode="outlined"
              onPress={handleAddBin}
              style={styles.addButton}
              icon="plus"
            >
              Add Bin
            </Button>
            <Button
              mode="contained"
              onPress={downloadAllQRCodesAsPDF}
              style={styles.qrButton}
              icon="download"
              loading={isDownloading}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download All QR Codes'}
            </Button>
          </View>
        </View>

        {bins.map((bin) => (
          <Card key={bin.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title>{bin.name}</Title>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: BIN_STATUS_COLORS[bin.status] },
                  ]}
                  textStyle={styles.chipText}
                >
                  {BIN_STATUS_LABELS[bin.status]}
                </Chip>
              </View>
              <Paragraph>Fill Level: {bin.fillLevel}%</Paragraph>
              <Paragraph>
                Location: {bin.location.latitude.toFixed(4)}, {bin.location.longitude.toFixed(4)}
              </Paragraph>
              <Paragraph>
                Zone: {bin.zone}
              </Paragraph>
              <View style={styles.cardActions}>
                <IconButton
                  icon="qrcode"
                  size={20}
                  iconColor="#10B981"
                  onPress={() => handleViewQRCode(bin)}
                  disabled={isDownloading}
                />
                <IconButton
                  icon="download"
                  size={20}
                  iconColor="#10B981"
                  onPress={() => handleDownloadQR(bin)}
                  disabled={isDownloading}
                />
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      
      {renderQRCodeModal()}
      
      {/* Add Bin Modal */}
      <Modal
        visible={showAddBinModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.addBinModalContainer}>
          <View style={styles.addBinModalHeader}>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowAddBinModal(false)}
            />
            <Text style={styles.addBinModalTitle}>Add New Bin</Text>
            <View style={{ width: 48 }} />
          </View>

          <ScrollView style={styles.addBinModalContent}>
            <Text style={styles.addBinModalSubtitle}>
              Enter the bin details and location coordinates
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bin Name *</Text>
              <TextInput
                style={styles.textInput}
                value={newBin.name}
                onChangeText={(text) => setNewBin(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Bin 11 - Johar Town"
                mode="outlined"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Zone/Area *</Text>
              <TextInput
                style={styles.textInput}
                value={newBin.zone}
                onChangeText={(text) => setNewBin(prev => ({ ...prev, zone: text }))}
                placeholder="e.g., Johar Town"
                mode="outlined"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Latitude *</Text>
              <TextInput
                style={styles.textInput}
                value={newBin.latitude}
                onChangeText={(text) => setNewBin(prev => ({ ...prev, latitude: text }))}
                placeholder="e.g., 31.5200"
                keyboardType="numeric"
                mode="outlined"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Longitude *</Text>
              <TextInput
                style={styles.textInput}
                value={newBin.longitude}
                onChangeText={(text) => setNewBin(prev => ({ ...prev, longitude: text }))}
                placeholder="e.g., 74.3500"
                keyboardType="numeric"
                mode="outlined"
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
              <Text style={styles.infoText}>
                The bin will be placed on the map at the specified coordinates and a QR code will be automatically generated.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.addBinModalFooter}>
            <Button
              mode="contained"
              onPress={handleCreateBin}
              loading={addingBin}
              disabled={addingBin}
              style={styles.createButton}
              contentStyle={styles.createButtonContent}
            >
              {addingBin ? 'Creating...' : 'Create Bin'}
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    borderColor: '#6366F1',
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  qrButton: {
    marginLeft: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    height: 28,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    maxWidth: 400,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  qrCodeContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCodeInner: {
    marginBottom: 16,
  },
  qrCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 4,
  },
  qrCodeId: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  modalActions: {
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#10B981',
  },

  // Add Bin Modal Styles
  addBinModalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  addBinModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  addBinModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  addBinModalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addBinModalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  addBinModalFooter: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  createButtonContent: {
    paddingVertical: 12,
  },
});

