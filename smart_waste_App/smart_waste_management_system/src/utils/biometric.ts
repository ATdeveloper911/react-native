import * as SecureStore from 'expo-secure-store';
import { UserRole } from '../types';

const KEY_ELIGIBLE = 'biometricEligible';
const KEY_USER_ID = 'biometricUserId';
const KEY_USER_ROLE = 'biometricUserRole';
const KEY_USER_EMAIL = 'biometricUserEmail';
const KEY_USER_NAME = 'biometricUserName';

export async function setBiometricEligible(userId: string, userRole?: UserRole, userEmail?: string, userName?: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY_ELIGIBLE, 'true');
    await SecureStore.setItemAsync(KEY_USER_ID, userId);
    if (userRole) {
      await SecureStore.setItemAsync(KEY_USER_ROLE, userRole);
    }
    if (userEmail) {
      await SecureStore.setItemAsync(KEY_USER_EMAIL, userEmail);
    }
    if (userName) {
      await SecureStore.setItemAsync(KEY_USER_NAME, userName);
    }
  } catch (_) {
    // Silently fail if SecureStore is not available
  }
}

export async function clearBiometricEligible(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY_ELIGIBLE);
    await SecureStore.deleteItemAsync(KEY_USER_ID);
    await SecureStore.deleteItemAsync(KEY_USER_ROLE);
    await SecureStore.deleteItemAsync(KEY_USER_EMAIL);
    await SecureStore.deleteItemAsync(KEY_USER_NAME);
  } catch (_) {
    // Silently fail if SecureStore is not available
  }
}

export async function getBiometricEligible(): Promise<{ 
  eligible: boolean; 
  userId: string | null;
  userRole: UserRole | null;
  userEmail: string | null;
  userName: string | null;
}> {
  try {
    const eligible = await SecureStore.getItemAsync(KEY_ELIGIBLE);
    const userId = await SecureStore.getItemAsync(KEY_USER_ID);
    const userRole = await SecureStore.getItemAsync(KEY_USER_ROLE) as UserRole | null;
    const userEmail = await SecureStore.getItemAsync(KEY_USER_EMAIL);
    const userName = await SecureStore.getItemAsync(KEY_USER_NAME);
    return { 
      eligible: eligible === 'true', 
      userId: userId || null,
      userRole: userRole || null,
      userEmail: userEmail || null,
      userName: userName || null,
    };
  } catch (_) {
    return { eligible: false, userId: null, userRole: null, userEmail: null, userName: null };
  }
}
