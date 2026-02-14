// Script to create admin user using Firebase Admin SDK
// Run with: node scripts/createAdminUserAdminSDK.mjs
// Requires: firebase-admin package

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '..', 'smartwastemanagement-c7500-firebase-adminsdk-fbsvc-822f425fd2.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://smartwastemanagement-c7500-default-rtdb.firebaseio.com'
});

const auth = admin.auth();
const db = admin.database();

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
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
      emailVerified: false
    });

    const userId = userRecord.uid;
    console.log('✅ User created in Firebase Auth with ID:', userId);

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

    await db.ref(`users/${userId}`).set(userData);
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
    
    if (error.code === 'auth/email-already-exists') {
      console.error('\n⚠️  User with this email already exists.');
      console.error('\nTo update the role:');
      console.error('1. Go to Firebase Console > Realtime Database');
      console.error('2. Find the user with email:', email);
      console.error('3. Navigate to users/{userId}');
      console.error('4. Update the role field to "admin"');
    }
    
    process.exit(1);
  }
}

createAdminUser();

