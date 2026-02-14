import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import {
  Card,
  Text,
  Title,
  Paragraph,
  Button,
  Avatar,
  Divider,
  IconButton,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { photoService } from '../../services/photoService';
import { updateProfile } from 'firebase/auth';
import { getAuthInstance } from '../../config/firebase';
import { theme } from '../../utils/theme';

export const ProfileScreen: React.FC = () => {
  const { user, userData, logout, refreshUserData } = useAuth();
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
    userData?.profilePicture || null
  );
  const [uploading, setUploading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userData?.profilePicture) {
      setProfilePictureUri(userData.profilePicture);
    }
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [userData?.profilePicture]);

  const handleImagePicker = async (source: 'gallery' | 'camera') => {
    try {
      let result;
      
      if (source === 'gallery') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera roll permissions');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera permissions');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        await uploadProfilePicture(uri);
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setUploading(true);
    try {
      // Animate the avatar while uploading
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Convert image to base64 data URL (no Firebase Storage needed)
      const photoURL = await photoService.convertToDataURL(uri);

      // Update user data in Realtime Database
      const updatedUserData = {
        ...userData!,
        profilePicture: photoURL,
      };
      await authService.saveUserData(user.uid, updatedUserData);

      // Update Firebase Auth profile
      try {
        const auth = await getAuthInstance();
        await updateProfile(auth.currentUser!, {
          photoURL: photoURL,
        });
      } catch (authError) {
        console.warn('Failed to update Auth profile photo:', authError);
        // Continue even if this fails
      }

      // Update local state
      setProfilePictureUri(photoURL);

      // Refresh user data in context
      await refreshUserData();

      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    if (!user) return;

    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setUploading(true);
            try {
              // Update user data to remove profile picture
              const updatedUserData = {
                ...userData!,
                profilePicture: undefined,
              };
              await authService.saveUserData(user.uid, updatedUserData);

              // Update Firebase Auth profile
              try {
                const auth = await getAuthInstance();
                await updateProfile(auth.currentUser!, {
                  photoURL: null,
                });
              } catch (authError) {
                console.warn('Failed to update Auth profile photo:', authError);
              }

              setProfilePictureUri(null);

              // Refresh user data in context
              await refreshUserData();

              Alert.alert('Success', 'Profile picture removed');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove profile picture');
            } finally {
              setUploading(false);
            }
          },
        },
      ]
    );
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery', ...(profilePictureUri ? ['Remove Photo'] : [])],
          cancelButtonIndex: 0,
          destructiveButtonIndex: profilePictureUri ? 3 : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleImagePicker('camera');
          } else if (buttonIndex === 2) {
            handleImagePicker('gallery');
          } else if (buttonIndex === 3 && profilePictureUri) {
            removeProfilePicture();
          }
        }
      );
    } else {
      // Android: Use Alert
      const options = ['Take Photo', 'Choose from Gallery'];
      if (profilePictureUri) {
        options.push('Remove Photo');
      }
      options.push('Cancel');

      Alert.alert(
        'Select Profile Picture',
        'Choose an option',
        [
          {
            text: 'Take Photo',
            onPress: () => handleImagePicker('camera'),
          },
          {
            text: 'Choose from Gallery',
            onPress: () => handleImagePicker('gallery'),
          },
          ...(profilePictureUri
            ? [
                {
                  text: 'Remove Photo',
                  style: 'destructive' as const,
                  onPress: removeProfilePicture,
                },
              ]
            : []),
          {
            text: 'Cancel',
            style: 'cancel' as const,
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'worker':
        return 'Worker';
      case 'citizen':
        return 'Citizen';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return '#F44336';
      case 'worker':
        return '#2196F3';
      case 'citizen':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#F0F9F1', '#F5F7FA']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Profile Picture Card */}
            <Card style={styles.profileCard}>
              <Card.Content style={styles.profileContent}>
                <View style={styles.avatarSection}>
                  <Animated.View
                    style={[
                      styles.avatarContainer,
                      {
                        transform: [{ scale: scaleAnim }],
                        backgroundColor: getRoleColor(userData?.role) + '20',
                      },
                    ]}
                  >
                    {uploading ? (
                      <View style={styles.uploadingContainer}>
                        <ActivityIndicator size="large" color={getRoleColor(userData?.role)} />
                      </View>
                    ) : profilePictureUri ? (
                      <Image source={{ uri: profilePictureUri }} style={styles.profileImage} />
                    ) : (
                      <Avatar.Text
                        size={120}
                        label={getInitials(userData?.name, userData?.email || user?.email || undefined)}
                        style={[styles.avatar, { backgroundColor: getRoleColor(userData?.role) }]}
                      />
                    )}
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(userData?.role) }]}>
                      <IconButton
                        icon="shield-check"
                        size={16}
                        iconColor="#FFFFFF"
                        style={styles.badgeIcon}
                      />
                    </View>

                    {/* Edit Button */}
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={showImagePickerOptions}
                      disabled={uploading}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={['#4CAF50', '#81C784']}
                        style={styles.editButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <IconButton icon="camera" size={20} iconColor="#FFFFFF" style={styles.editIcon} />
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <Title style={styles.name}>{userData?.name || user?.displayName || 'User'}</Title>
                  <Paragraph style={styles.email}>{userData?.email || user?.email || ''}</Paragraph>
                  <View
                    style={[
                      styles.roleBadgeLarge,
                      { backgroundColor: getRoleColor(userData?.role) + '20' },
                    ]}
                  >
                    <IconButton
                      icon="account"
                      size={20}
                      iconColor={getRoleColor(userData?.role)}
                      style={styles.roleIcon}
                    />
                    <Text
                      style={[styles.roleText, { color: getRoleColor(userData?.role) }]}
                    >
                      {getRoleLabel(userData?.role)}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Account Information Card */}
            <Card style={styles.infoCard}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <IconButton
                    icon="information"
                    size={24}
                    iconColor={theme.colors.primary}
                    style={styles.sectionIcon}
                  />
                  <Title style={styles.sectionTitle}>Account Information</Title>
                </View>
                <Divider style={styles.divider} />

                <InfoRow icon="email" label="Email" value={userData?.email || user?.email || 'N/A'} />
                <InfoRow
                  icon="account-star"
                  label="Role"
                  value={getRoleLabel(userData?.role)}
                  valueColor={getRoleColor(userData?.role)}
                />
                <InfoRow
                  icon="check-circle"
                  label="Account Status"
                  value={userData?.isActive ? 'Active' : 'Inactive'}
                  valueColor={userData?.isActive ? theme.colors.success : theme.colors.error}
                />
                {userData?.createdAt && (
                  <InfoRow
                    icon="calendar"
                    label="Member Since"
                    value={new Date(userData.createdAt).toLocaleDateString()}
                  />
                )}
              </Card.Content>
            </Card>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} activeOpacity={0.8} style={styles.logoutButtonContainer}>
              <LinearGradient
                colors={['#F44336', '#E57373']}
                style={styles.logoutButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconButton icon="logout" size={20} iconColor="#FFFFFF" style={styles.logoutIcon} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <IconButton icon={icon} size={20} iconColor={theme.colors.textSecondary} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  profileCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.lg,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    ...theme.shadows.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    ...theme.shadows.md,
  },
  uploadingContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  roleBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: theme.borderRadius.round,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  badgeIcon: {
    margin: 0,
  },
  editButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  editButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    margin: 0,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
    color: theme.colors.text,
  },
  email: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  roleBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginTop: theme.spacing.xs,
  },
  roleIcon: {
    margin: 0,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionIcon: {
    margin: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  divider: {
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    margin: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'right',
  },
  logoutButtonContainer: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  logoutIcon: {
    margin: 0,
    marginRight: theme.spacing.xs,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
