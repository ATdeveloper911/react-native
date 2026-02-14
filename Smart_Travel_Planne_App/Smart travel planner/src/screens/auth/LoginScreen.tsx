import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { theme } from '../../utils/theme';
import { getBiometricEligible } from '../../utils/biometric';

type NavigationProp = StackNavigationProp<AuthStackParamList>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEligible, setBiometricEligible] = useState(false);
  const { login, user, userData, restoreUserFromBiometric } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricAvailable(compatible && enrolled);
        
        const stored = await getBiometricEligible();
        setBiometricEligible(stored.eligible);
      } catch (error) {
        console.warn('Error checking biometric availability:', error);
        setBiometricAvailable(false);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Success - navigation will happen automatically via AppNavigator
      // Clear form
      setEmail('');
      setPassword('');
      // Update biometric eligibility
      const stored = await getBiometricEligible();
      setBiometricEligible(stored.eligible);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprint = async () => {
    // Check if user is eligible (has logged in before)
    const stored = await getBiometricEligible();
    if (!stored.eligible) {
      Alert.alert('Sign in required', 'Please login first with your credentials to use fingerprint.');
      return;
    }

    if (!biometricAvailable) {
      Alert.alert('Not available', 'Biometric authentication is not set up on your device.');
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // User authenticated with biometric
        // Check if user already exists in AuthContext
        if (user && userData) {
          // User is already authenticated - AppNavigator will navigate automatically
          return;
        }
        
        // Get stored biometric data
        const biometricData = await getBiometricEligible();
        
        if (!biometricData.userId || !biometricData.userRole || !biometricData.userEmail) {
          // Missing stored data - user needs to login with credentials
          Alert.alert('Session expired', 'Please login again with your credentials.');
          return;
        }
        
        // Restore user from stored biometric data - this will allow immediate navigation
        // AppNavigator will detect userData change and navigate to the correct dashboard
        await restoreUserFromBiometric(
          biometricData.userId,
          biometricData.userRole,
          biometricData.userEmail,
          biometricData.userName || undefined
        );
        
        // Navigation will happen automatically via AppNavigator when userData is set
      } else {
        if (result.error !== 'user_cancel') {
          Alert.alert('Authentication failed', 'Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'Failed to authenticate. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#4CAF50', '#66BB6A', '#81C784']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <IconButton 
                icon="arrow-left" 
                size={28} 
                iconColor="#FFFFFF" 
                onPress={() => navigation.navigate('Landing')}
                style={styles.backButton}
              />
            </View>

            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <IconButton icon="recycle" size={48} iconColor="#4CAF50" />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="email" />}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!passwordVisible}
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.primary}
              />

              {error ? (
                <HelperText type="error" style={styles.errorText}>
                  {error}
                </HelperText>
              ) : null}

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
                buttonColor={theme.colors.primary}
                icon="login"
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Sign In
              </Button>

              {biometricAvailable && (
                <TouchableOpacity
                  onPress={handleFingerprint}
                  disabled={loading}
                  style={styles.fingerprintButton}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#66BB6A']}
                    style={styles.fingerprintGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="finger-print" size={28} color="#FFFFFF" />
                    <Text style={styles.fingerprintText}>Use Fingerprint</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
                style={styles.registerButton}
              >
                Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Landing')}
                disabled={loading}
                style={styles.homeButton}
                icon="home"
                textColor={theme.colors.textSecondary}
              >
                Back to Home
              </Button>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    marginBottom: theme.spacing.sm,
  },
  button: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    marginTop: theme.spacing.md,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  homeButton: {
    marginTop: theme.spacing.sm,
  },
  fingerprintButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  fingerprintGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  fingerprintText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

