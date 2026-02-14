// Script to create the first admin user
// Run with: node scripts/createAdminUser.mjs

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB82EcwoEjS97xLerlTsT9ujLpTHtdn26U",
  authDomain: "smartwastemanagement-c7500.firebaseapp.com",
  databaseURL: "https://smartwastemanagement-c7500-default-rtdb.firebaseio.com",
  projectId: "smartwastemanagement-c7500",
  storageBucket: "smartwastemanagement-c7500.firebasestorage.app",
  messagingSenderId: "154980746966",
  appId: "1:154980746966:android:660b66d1e569fa33752b77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

async function createAdminUser() {
  try {
    const email = 'asadullahkamboh111@gmail.com';
    const password = '123456';
    const name = 'Minahil Imran';
    const role = 'admin';

    console.log('🚀 Starting admin user creation...');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Role:', role);
    console.log('');

    // Create user in Firebase Auth
    console.log('Creating user in Firebase Authentication...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    console.log('✅ User created in Firebase Auth with ID:', userId);

    // Update display name
    console.log('Updating display name...');
    await updateProfile(userCredential.user, { displayName: name });
    console.log('✅ Display name updated');

    // Create user document in Realtime Database
    console.log('Creating user document in Realtime Database...');
    const userData = {
      id: userId,
      email: email,
      role: role,
      name: name,
      createdAt: Date.now(),
      isActive: true
    };

    await set(ref(db, `users/${userId}`), userData);
    console.log('✅ User document created in Realtime Database');

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Role:', role);
    console.log('\nYou can now login to the app with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'auth/email-already-in-use') {
      console.error('\n⚠️  User with this email already exists.');
      console.error('\nTo fix this:');
      console.error('1. Go to Firebase Console > Authentication');
      console.error('2. Find the user with email:', email);
      console.error('3. Copy the User UID');
      console.error('4. Go to Realtime Database > users/{userId}');
      console.error('5. Update the role field to "admin"');
      console.error('\nOr delete the user from Authentication and run this script again.');
    } else if (error.code === 'auth/weak-password') {
      console.error('\n⚠️  Password is too weak.');
      console.error('Firebase requires passwords to be at least 6 characters.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('\n⚠️  Invalid email address.');
    }
    
    process.exit(1);
  }
}

createAdminUser();

