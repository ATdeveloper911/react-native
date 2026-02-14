import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, IconButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

const REPORT_TYPES = [
  { value: 'missed-collection', label: 'Missed' },
  { value: 'overflow', label: 'Overflow' },
  { value: 'damage', label: 'Damage' },
  { value: 'other', label: 'Other' },
];

export const ReportScreen: React.FC = () => {
  const { user } = useAuth();
  const [type, setType] = useState<string>('missed-collection');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a report');
      return;
    }

    setLoading(true);
    try {
      await reportService.createReport({
        userId: user.uid,
        type: type as any,
        description,
        photos,
      });
      Alert.alert('Success', 'Report submitted successfully');
      setDescription('');
      setPhotos([]);
      setType('missed-collection');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (value: string) => {
    switch (value) {
      case 'missed-collection':
        return 'calendar-remove';
      case 'overflow':
        return 'alert-circle';
      case 'damage':
        return 'alert-octagon';
      case 'other':
        return 'help-circle';
      default:
        return 'alert';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#F0F9F1', '#F5F7FA']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Report an Issue</Text>
              <Text style={styles.headerSubtitle}>Help us improve waste management</Text>
            </View>
            <IconButton icon="alert-circle-outline" size={32} iconColor={theme.colors.error} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Issue Type */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.label}>Issue Type</Text>
                <View style={styles.typeButtons}>
                  {REPORT_TYPES.map((rt) => (
                    <TouchableOpacity
                      key={rt.value}
                      style={[
                        styles.typeButton,
                        type === rt.value && styles.typeButtonActive,
                      ]}
                      onPress={() => setType(rt.value)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={
                          type === rt.value
                            ? ['#4CAF50', '#81C784']
                            : ['#FFFFFF', '#FFFFFF']
                        }
                        style={styles.typeButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <IconButton
                          icon={getTypeIcon(rt.value)}
                          size={24}
                          iconColor={type === rt.value ? '#FFFFFF' : theme.colors.textSecondary}
                          style={styles.typeIcon}
                        />
                        <Text
                          style={[
                            styles.typeButtonText,
                            type === rt.value && styles.typeButtonTextActive,
                          ]}
                        >
                          {rt.label}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card.Content>
            </Card>

            {/* Description */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  mode="outlined"
                  multiline
                  numberOfLines={6}
                  placeholder="Describe the issue in detail..."
                  style={styles.input}
                  outlineColor={theme.colors.outlineVariant}
                  activeOutlineColor={theme.colors.primary}
                />
              </Card.Content>
            </Card>

            {/* Photos Section */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.label}>Photos (Optional)</Text>
                <Text style={styles.helperText}>
                  Add photos to help us understand the issue better
                </Text>

                <View style={styles.photoButtons}>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={pickImage}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#2196F3', '#64B5F6']}
                      style={styles.photoButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <IconButton icon="image-outline" size={24} iconColor="#FFFFFF" style={styles.icon} />
                      <Text style={styles.photoButtonText}>Gallery</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={takePhoto}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#FF9800', '#FFB74D']}
                      style={styles.photoButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <IconButton icon="camera-outline" size={24} iconColor="#FFFFFF" style={styles.icon} />
                      <Text style={styles.photoButtonText}>Camera</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {photos.length > 0 && (
                  <View style={styles.photosContainer}>
                    {photos.map((uri, index) => (
                      <View key={index} style={styles.photoWrapper}>
                        <Image source={{ uri }} style={styles.photo} />
                        <TouchableOpacity
                          style={styles.removePhotoButton}
                          onPress={() => removePhoto(index)}
                          activeOpacity={0.7}
                        >
                          <IconButton icon="close-circle" size={24} iconColor={theme.colors.error} style={styles.icon} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
              <LinearGradient
                colors={['#4CAF50', '#81C784']}
                style={styles.submitButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {loading ? (
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                    <IconButton icon="send" size={20} iconColor="#FFFFFF" style={styles.icon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs / 2,
  },
  typeButton: {
    width: (width - theme.spacing.md * 2 - theme.spacing.xs) / 2,
    margin: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.outlineVariant,
  },
  typeButtonActive: {
    borderColor: theme.colors.primary,
    ...theme.shadows.md,
  },
  typeButtonGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  typeIcon: {
    margin: 0,
    marginBottom: theme.spacing.xs,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: theme.colors.background,
  },
  photoButtons: {
    flexDirection: 'row',
    marginHorizontal: -theme.spacing.xs / 2,
    marginBottom: theme.spacing.md,
  },
  photoButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  photoButtonGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  icon: {
    margin: 0,
    marginBottom: theme.spacing.xs / 2,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs / 2,
  },
  photoWrapper: {
    width: (width - theme.spacing.md * 2 - theme.spacing.xs * 2) / 3,
    margin: theme.spacing.xs / 2,
    position: 'relative',
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.sm,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: theme.spacing.xs,
  },
});
