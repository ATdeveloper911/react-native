import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { TextInput, IconButton, Badge } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/AuthContext';
import { StatsGrid } from '../../components/citizen/StatsGrid';
import { SwipableCardStack } from '../../components/citizen/SwipableCardStack';
import { TipsCarousel } from '../../components/citizen/TipsCarousel';
import { binService } from '../../services/binService';
import { Bin } from '../../types';
import { theme } from '../../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CitizenStackParamList, CitizenTabParamList } from '../../navigation/CitizenNavigator';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<CitizenTabParamList, 'Home'>,
  StackNavigationProp<CitizenStackParamList>
>;

const { width, height } = Dimensions.get('window');

export const CitizenDashboardScreen: React.FC = () => {
  const { userData } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [bins, setBins] = useState<Bin[]>([]);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const displayedBins = bins.filter((bin) => {
    if (!userData?.zone) return true;
    const anyBinsHaveZone = bins.some((b) => !!b.zone);
    if (!anyBinsHaveZone) return true;
    return bin.zone === userData.zone;
  });

  // Animation values
  const avatarScale = useRef(new Animated.Value(0)).current;
  const greetingOpacity = useRef(new Animated.Value(0)).current;
  const greetingTranslate = useRef(new Animated.Value(-20)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameTranslate = useRef(new Animated.Value(-20)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const searchTranslate = useRef(new Animated.Value(10)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subscribe to bins
    const unsubscribe = binService.subscribeToBins((binsData) => {
      setBins(binsData);
    });

    // Animate header elements
    Animated.parallel([
      Animated.spring(avatarScale, {
        toValue: 1,
        delay: 0,
        useNativeDriver: true,
      }),
      Animated.timing(greetingOpacity, {
        toValue: 1,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(greetingTranslate, {
        toValue: 0,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(nameTranslate, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(searchTranslate, {
        toValue: 0,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      unsubscribe();
    };
  }, []);

  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon 👋';
    return 'Good Evening 👋';
  };

  const showProfilePicture = () => {
    if (!userData?.profilePicture) {
      // If no profile picture, navigate to profile screen
      navigation.navigate('Profile');
      return;
    }
    
    setShowProfileModal(true);
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideProfilePicture = () => {
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowProfileModal(false);
    });
  };

  const quickActions = [
    { id: 1, label: 'Report Issue', emoji: '📝', icon: 'alert-circle', route: 'Report' },
    { id: 2, label: 'Scan Bin', emoji: '�', icon: 'qrcode-scan', route: 'BinScanner' },
    { id: 3, label: 'Schedule', emoji: '📅', icon: 'calendar', route: 'Schedule' },
    { id: 4, label: 'Learn', emoji: '📚', icon: 'book-open-variant', route: 'Learn' },
  ];

  const quickActionsOpacity = useRef(new Animated.Value(0)).current;
  const quickActionsTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(quickActionsOpacity, {
        toValue: 1,
        duration: 400,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(quickActionsTranslate, {
        toValue: 0,
        duration: 400,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <TouchableOpacity
                onPress={showProfilePicture}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.avatarContainer,
                    {
                      transform: [{ scale: avatarScale }],
                    },
                  ]}
                >
                  {userData?.profilePicture ? (
                    <Image
                      source={{ uri: userData.profilePicture }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <LinearGradient
                      colors={['#4CAF50', '#81C784']}
                      style={styles.avatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.avatarText}>{getUserInitials()}</Text>
                    </LinearGradient>
                  )}
                </Animated.View>
              </TouchableOpacity>
              <View style={styles.userText}>
                <Animated.Text
                  style={[
                    styles.greeting,
                    {
                      opacity: greetingOpacity,
                      transform: [{ translateX: greetingTranslate }],
                    },
                  ]}
                >
                  {getGreeting()}
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.userName,
                    {
                      opacity: nameOpacity,
                      transform: [{ translateX: nameTranslate }],
                    },
                  ]}
                >
                  {userData?.name || 'User'}
                </Animated.Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <IconButton icon="magnify" size={20} iconColor={theme.colors.textSecondary} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <IconButton icon="bell-outline" size={20} iconColor={theme.colors.textSecondary} style={styles.icon} />
                {notificationCount > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: searchOpacity,
                transform: [{ translateY: searchTranslate }],
              },
            ]}
          >
            <IconButton icon="magnify" size={20} iconColor={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              placeholder="Search bins, routes, or reports..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              mode="flat"
              style={styles.searchInput}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </Animated.View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Actions */}
          <Animated.View
            style={[
              styles.quickActionsContainer,
              {
                opacity: quickActionsOpacity,
                transform: [{ translateY: quickActionsTranslate }],
              },
            ]}
          >
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                style={[
                  {
                    opacity: quickActionsOpacity,
                    transform: [
                      {
                        scale: quickActionsOpacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.quickActionButton}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (action.route === 'Report' || action.route === 'Map') {
                      // Report and Map are in tabs
                      (navigation as any).navigate(action.route);
                    } else {
                      // Schedule and Learn are in stack navigator (parent)
                      const parentNav = navigation.getParent();
                      if (parentNav) {
                        (parentNav as any).navigate(action.route);
                      }
                    }
                  }}
                >
                  <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Stats Grid */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <StatsGrid />
          </View>

          {/* Swipable Cards */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bin Status</Text>
              <Text style={styles.swipeHintText}>Swipe cards →</Text>
            </View>
            <SwipableCardStack bins={displayedBins} />
          </View>

          {/* Tips Carousel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Eco Tips</Text>
            <TipsCarousel />
          </View>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>

      {/* Profile Picture Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="none"
        onRequestClose={hideProfilePicture}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={hideProfilePicture}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                { 
                  transform: [{ scale: modalScale }],
                  opacity: modalOpacity 
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={hideProfilePicture}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
              
              {userData?.profilePicture && (
                <Image 
                  source={{ uri: userData.profilePicture }} 
                  style={styles.fullProfileImage}
                  resizeMode="contain"
                />
              )}
              
              <View style={styles.modalFooter}>
                <Text style={styles.modalUserName}>{userData?.name || 'User'}</Text>
                <TouchableOpacity 
                  style={styles.editProfileButton}
                  onPress={() => {
                    hideProfilePicture();
                    navigation.navigate('Profile');
                  }}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#81C784']}
                    style={styles.editButtonGradient}
                  >
                    <Ionicons name="camera" size={16} color="#ffffff" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
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
    paddingTop: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: theme.spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs / 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.sm,
    position: 'relative',
  },
  icon: {
    margin: 0,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.sm,
    paddingRight: theme.spacing.sm,
  },
  searchIcon: {
    margin: 0,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.sm,
    minHeight: 80,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  swipeHintText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullProfileImage: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    marginTop: 20,
    marginBottom: 20,
  },
  modalFooter: {
    alignItems: 'center',
    width: '100%',
  },
  modalUserName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  editProfileButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});
