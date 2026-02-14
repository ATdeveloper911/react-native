import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { theme } from '../../utils/theme';

export const BinQRCodeAssignmentScreen: React.FC = () => {
  const navigation = useNavigation();

  // Mock bins data - in real app this would come from binService
  const bins = [
    {
      id: 'liberty-market',
      name: 'Liberty Market Bin',
      location: 'Liberty Market, Gulberg III',
      qrData: JSON.stringify({
        type: 'smart_bin',
        binId: 'liberty-market',
        name: 'Liberty Market Bin',
        location: { latitude: 31.5105, longitude: 74.3440 },
        timestamp: Date.now(),
      }),
    },
    {
      id: 'mm-alam-road',
      name: 'MM Alam Road Bin',
      location: 'MM Alam Road, Gulberg III',
      qrData: JSON.stringify({
        type: 'smart_bin',
        binId: 'mm-alam-road',
        name: 'MM Alam Road Bin',
        location: { latitude: 31.5090, longitude: 74.3465 },
        timestamp: Date.now(),
      }),
    },
    {
      id: 'main-blvd',
      name: 'Main Boulevard Bin',
      location: 'Main Boulevard, Gulberg III',
      qrData: JSON.stringify({
        type: 'smart_bin',
        binId: 'main-blvd',
        name: 'Main Boulevard Bin',
        location: { latitude: 31.5125, longitude: 74.3420 },
        timestamp: Date.now(),
      }),
    },
    {
      id: 'mini-market',
      name: 'Mini Market Bin',
      location: 'Mini Market, Gulberg III',
      qrData: JSON.stringify({
        type: 'smart_bin',
        binId: 'mini-market',
        name: 'Mini Market Bin',
        location: { latitude: 31.5140, longitude: 74.3480 },
        timestamp: Date.now(),
      }),
    },
    {
      id: 'ghalib-rd',
      name: 'Ghalib Road Bin',
      location: 'Ghalib Road, Gulberg III',
      qrData: JSON.stringify({
        type: 'smart_bin',
        binId: 'ghalib-rd',
        name: 'Ghalib Road Bin',
        location: { latitude: 31.5070, longitude: 74.3410 },
        timestamp: Date.now(),
      }),
    },
  ];

  const handlePrintAll = () => {
    Alert.alert(
      'Print All QR Codes',
      'This would generate a PDF with all bin QR codes for printing. Each QR code should be printed and attached to its corresponding physical bin.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate PDF', onPress: () => console.log('Generate PDF with all QR codes') },
      ]
    );
  };

  const handlePrintSingle = (bin: any) => {
    Alert.alert(
      `Print ${bin.name} QR Code`,
      `Generate printable QR code for ${bin.name} to be attached to the physical bin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Print', onPress: () => console.log(`Print QR for ${bin.id}`) },
      ]
    );
  };

  const handleDownloadQR = (bin: any) => {
    Alert.alert(
      `Download ${bin.name} QR Code`,
      `Save QR code as image file for ${bin.name}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => console.log(`Download QR for ${bin.id}`) },
      ]
    );
  };

  const handleTestScan = (bin: any) => {
    Alert.alert(
      'Test QR Code',
      `QR Code Data for ${bin.name}:\n\n${bin.qrData}\n\nThis is what the citizen scanner will read when scanning this bin.`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bin QR Code Assignment</Text>
      </View>

      <View style={styles.content}>
        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Card.Content>
            <Text style={styles.instructionsTitle}>How QR Codes Work</Text>
            <View style={styles.instructionList}>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.instructionText}>Each bin gets a unique QR code with its ID and location</Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.instructionText}>Print QR codes and attach them to physical bins</Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.instructionText}>Citizens scan QR codes with "Scan Bin" feature</Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.instructionText}>System automatically identifies bin and updates fill level</Text>
              </View>
            </View>
            
            <Button
              mode="contained"
              onPress={handlePrintAll}
              style={styles.printAllButton}
              icon="printer"
            >
              Print All QR Codes
            </Button>
          </Card.Content>
        </Card>

        {/* QR Codes List */}
        <Text style={styles.sectionTitle}>Individual Bin QR Codes</Text>
        
        {bins.map((bin) => (
          <Card key={bin.id} style={styles.qrCard}>
            <Card.Content>
              <View style={styles.qrRow}>
                <View style={styles.qrInfo}>
                  <Text style={styles.binName}>{bin.name}</Text>
                  <Text style={styles.binLocation}>{bin.location}</Text>
                  <Text style={styles.binId}>ID: {bin.id}</Text>
                </View>
                
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={bin.qrData}
                    size={80}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                  />
                </View>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={() => handlePrintSingle(bin)}
                  style={styles.actionButton}
                  compact
                  icon="printer"
                >
                  Print
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleDownloadQR(bin)}
                  style={styles.actionButton}
                  compact
                  icon="download"
                >
                  Download
                </Button>
                <Button
                  mode="text"
                  onPress={() => handleTestScan(bin)}
                  style={styles.actionButton}
                  compact
                  icon="qr-code"
                >
                  Test
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Implementation Note */}
        <Card style={styles.noteCard}>
          <Card.Content>
            <View style={styles.noteHeader}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text style={styles.noteTitle}>Implementation Note</Text>
            </View>
            <Text style={styles.noteText}>
              In production, these QR codes should be printed on weather-resistant materials and securely attached to each bin. The QR data contains the bin ID and location, allowing the mobile app to automatically identify which bin is being scanned.
            </Text>
          </Card.Content>
        </Card>
      </View>
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
  instructionsCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  instructionList: {
    gap: 12,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
  printAllButton: {
    backgroundColor: theme.colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  qrCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrInfo: {
    flex: 1,
    marginRight: 16,
  },
  binName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  binLocation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  binId: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontFamily: 'monospace',
  },
  qrCodeContainer: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 1,
    marginTop: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  noteText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
});
