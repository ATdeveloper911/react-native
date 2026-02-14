import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText, SegmentedButtons, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { RESIDENTIAL_ZONES } from '../../utils/constants';
import { theme } from '../../utils/theme';

type NavigationProp = StackNavigationProp<AuthStackParamList>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { register, user, userData } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [zone, setZone] = useState<string>(RESIDENTIAL_ZONES[0]?.name ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Navigate to dashboard when user is successfully registered and logged in
  useEffect(() => {
    if (user && userData && success) {
      // User is logged in and data is loaded, navigation will happen automatically via AppNavigator
      setSuccess(false);
    }
  }, [user, userData, success]);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all required fields');
      return;
    }

    if (role === 'citizen' && !zone) {
      setError('Please select your residential zone');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await register(email, password, name, role, role === 'citizen' ? zone : undefined);
      setSuccess(true);
      Alert.alert(
        'Success!',
        'Account created successfully. You will be redirected to your dashboard.',
        [{ text: 'OK' }]
      );
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setRole('citizen');
      setZone(RESIDENTIAL_ZONES[0]?.name ?? '');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      Alert.alert('Registration Failed', err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#2196F3', '#42A5F5', '#64B5F6']}
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
                <IconButton icon="account-plus" size={48} iconColor="#2196F3" />
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join SmartWaste today</Text>
            </View>

            <View style={styles.formContainer}>

              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="account" />}
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.secondary}
              />

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
                activeOutlineColor={theme.colors.secondary}
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
                activeOutlineColor={theme.colors.secondary}
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry={!confirmPasswordVisible}
                style={styles.input}
                disabled={loading}
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={confirmPasswordVisible ? "eye-off" : "eye"}
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  />
                }
                outlineColor={theme.colors.border}
                activeOutlineColor={theme.colors.secondary}
              />

          <View style={styles.roleContainer}>
            <Text variant="labelLarge" style={styles.roleLabel}>
              I am a:
            </Text>
            <SegmentedButtons
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              buttons={[
                { value: 'citizen', label: 'Citizen' },
                { value: 'worker', label: 'Worker' },
                { value: 'admin', label: 'Admin' },
              ]}
              style={styles.roleButtons}
            />
          </View>

              {role === 'citizen' && (
                <View style={styles.roleContainer}>
                  <Text variant="labelLarge" style={styles.roleLabel}>
                    Residential Zone
                  </Text>
                  <SegmentedButtons
                    value={zone}
                    onValueChange={(value) => setZone(value)}
                    buttons={RESIDENTIAL_ZONES.map((z) => ({ value: z.name, label: z.name }))}
                    style={styles.roleButtons}
                  />
                </View>
              )}

              {error ? (
                <HelperText type="error" style={styles.errorText}>
                  {error}
                </HelperText>
              ) : null}
              {success ? (
                <HelperText type="info" style={styles.successText}>
                  Account created successfully! Redirecting...
                </HelperText>
              ) : null}

              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.button}
                buttonColor={theme.colors.secondary}
                icon="account-plus"
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Sign Up
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
                style={styles.loginButton}
              >
                Already have an account? <Text style={styles.linkText}>Sign In</Text>
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
  roleContainer: {
    marginBottom: theme.spacing.md,
  },
  roleLabel: {
    marginBottom: theme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtons: {
    marginBottom: theme.spacing.xs,
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
  loginButton: {
    marginTop: theme.spacing.md,
  },
  linkText: {
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  homeButton: {
    marginTop: theme.spacing.sm,
  },
  successText: {
    color: theme.colors.success,
    marginBottom: theme.spacing.sm,
    fontSize: 14,
  },
});

