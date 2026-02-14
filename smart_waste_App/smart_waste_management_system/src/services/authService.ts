import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { ref, set, get, onValue, off } from 'firebase/database';
import { getAuthInstance, database } from '../config/firebase';
import { User, UserRole } from '../types';

export const authService = {
  async register(email: string, password: string, name: string, role: UserRole, zone?: string): Promise<FirebaseUser> {
    try {
      const auth = await getAuthInstance();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      try {
        await updateProfile(user, { displayName: name });
      } catch (profileError) {
        console.warn('Failed to update profile:', profileError);
        // Continue even if profile update fails
      }

      // Create user profile in database
      const userData: User = {
        id: user.uid,
        email: user.email!,
        role,
        name,
        createdAt: Date.now(),
        isActive: true,
      };

      if (zone !== undefined) {
        userData.zone = zone;
      }

      // Write to database and verify it was written
      const userRef = ref(database, `users/${user.uid}`);
      await set(userRef, userData);
      
      // Verify the write was successful by reading it back
      const verifySnapshot = await get(userRef);
      if (!verifySnapshot.exists()) {
        console.error('Failed to verify user data write to database');
        throw new Error('Failed to save user data to database');
      }
      console.log('User data successfully written to database:', verifySnapshot.val());

      return user;
    } catch (error: any) {
      // Format Firebase auth errors for better user experience
      let errorMessage = 'Failed to register';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  async login(email: string, password: string): Promise<FirebaseUser> {
    try {
      const auth = await getAuthInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      // Format Firebase auth errors for better user experience
      let errorMessage = 'Failed to login';
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  async logout(): Promise<void> {
    const auth = await getAuthInstance();
    await signOut(auth);
  },

  async saveUserData(userId: string, userData: User): Promise<void> {
    try {
      const userRef = ref(database, `users/${userId}`);
      await set(userRef, userData);
      console.log('User data saved successfully:', userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  async getUserData(userId: string, retries = 5): Promise<User | null> {
    const userRef = ref(database, `users/${userId}`);
    
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempting to fetch user data (attempt ${i + 1}/${retries}) for userId: ${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val() as User;
          console.log(`✅ User data found on attempt ${i + 1}:`, data);
          return data;
        } else {
          console.log(`❌ User data not found at path: users/${userId}`);
        }
        
        // If data doesn't exist yet, wait a bit and retry (for newly created users)
        if (i < retries - 1) {
          const delay = 500 * (i + 1); // 500ms, 1000ms, 1500ms, 2000ms, 2500ms
          console.log(`⏳ Retrying in ${delay}ms... (attempt ${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error: any) {
        console.error(`❌ Error fetching user data (attempt ${i + 1}):`, error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Check for permission errors
        if (error.code === 'PERMISSION_DENIED' || error.message?.includes('permission')) {
          console.error('⚠️ Permission denied when reading user data. Check Firebase Realtime Database rules.');
          throw new Error('Permission denied. Please check database rules.');
        }
        
        if (i < retries - 1) {
          const delay = 500 * (i + 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.warn(`⚠️ User data not found after ${retries} attempts for userId: ${userId}`);
    return null;
  },

  subscribeToWorkers(callback: (workers: User[]) => void): () => void {
    const usersRef = ref(database, 'users');

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const workers: User[] = [];

      if (usersData) {
        Object.keys(usersData).forEach((userId) => {
          const user = usersData[userId];
          if (user?.role === 'worker') {
            workers.push({
              id: userId,
              ...user,
            });
          }
        });
      }

      callback(workers);
    });

    return () => {
      off(usersRef);
    };
  },
};

