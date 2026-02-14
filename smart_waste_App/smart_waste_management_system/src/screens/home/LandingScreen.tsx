import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, IconButton, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');
type NavigationProp = StackNavigationProp<AuthStackParamList>;

export const LandingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const features = [
    {
      icon: 'map-marker',
      title: 'Smart Bin Tracking',
      description: 'Real-time location tracking of waste bins across the city',
      color: '#4CAF50',
    },
    {
      icon: 'alert-circle',
      title: 'Instant Reporting',
      description: 'Report issues and overflowing bins instantly',
      color: '#FF9800',
    },
    {
      icon: 'chart-line',
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for waste management',
      color: '#2196F3',
    },
    {
      icon: 'recycle',
      title: 'Eco-Friendly',
      description: 'Promote sustainable waste management practices',
      color: '#4CAF50',
    },
  ];

  const stats = [
    { value: '1000+', label: 'Smart Bins' },
    { value: '50+', label: 'Routes' },
    { value: '24/7', label: 'Monitoring' },
    { value: '95%', label: 'Efficiency' },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Login Button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoRow}>
              <Text style={styles.logoIcon}>♻️</Text>
              <Text style={styles.logo}>SmartWaste</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
            <IconButton icon="arrow-right" size={16} iconColor="#FFFFFF" style={{ margin: 0, marginLeft: -2 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section with Gradient */}
      <LinearGradient
        colors={['#4CAF50', '#66BB6A', '#81C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Transform Waste Management</Text>
          <Text style={styles.heroSubtitle}>
            Intelligent solutions for a cleaner, greener future
          </Text>
          <View style={styles.heroButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.ctaButton}
              buttonColor="#FFFFFF"
              textColor="#4CAF50"
              icon="arrow-right"
              contentStyle={styles.ctaButtonContent}
              labelStyle={styles.ctaButtonLabel}
            >
              Get Started
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={styles.secondaryButton}
              textColor="#FFFFFF"
              labelStyle={styles.secondaryButtonLabel}
            >
              Sign Up
            </Button>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <Card.Content style={styles.featureContent}>
                <View style={[styles.featureIconContainer, { backgroundColor: feature.color + '20' }]}>
                  <IconButton icon={feature.icon} size={32} iconColor={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Benefits Section */}
      <LinearGradient
        colors={['#2196F3', '#42A5F5', '#64B5F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.benefitsSection}
      >
        <Text style={styles.benefitsTitle}>Why Choose SmartWaste?</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <IconButton icon="check-circle" size={24} iconColor="#FFFFFF" style={{ margin: 0 }} />
            <Text style={styles.benefitText}>Real-time monitoring and alerts</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconButton icon="check-circle" size={24} iconColor="#FFFFFF" style={{ margin: 0 }} />
            <Text style={styles.benefitText}>Optimized collection routes</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconButton icon="check-circle" size={24} iconColor="#FFFFFF" style={{ margin: 0 }} />
            <Text style={styles.benefitText}>Data-driven decision making</Text>
          </View>
          <View style={styles.benefitItem}>
            <IconButton icon="check-circle" size={24} iconColor="#FFFFFF" style={{ margin: 0 }} />
            <Text style={styles.benefitText}>Environmental sustainability</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
        <Text style={styles.ctaSubtitle}>Join thousands of users managing waste efficiently</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Register')}
          style={styles.finalCtaButton}
          buttonColor="#4CAF50"
          icon="account-plus"
          contentStyle={styles.finalCtaContent}
          labelStyle={styles.finalCtaLabel}
        >
          Create Account
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 28,
    marginRight: theme.spacing.sm,
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 11,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.md,
    justifyContent: 'center',
    minHeight: 44,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroSection: {
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaButton: {
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  ctaButtonContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  ctaButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    marginTop: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresSection: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - theme.spacing.md * 3) / 2,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  featureContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  featureIconContainer: {
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.md,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  benefitsSection: {
    padding: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  benefitsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  benefitsList: {
    gap: theme.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  ctaSection: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  finalCtaButton: {
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  finalCtaContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
  finalCtaLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
});

