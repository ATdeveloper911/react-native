# Firebase Database Setup Guide

## Important: This App Uses Realtime Database, NOT Firestore

This app uses **Firebase Realtime Database**, not Firestore. The user data is stored in the Realtime Database at the path `users/{userId}`.

## Database Structure

The Firebase Realtime Database should have this structure:

```
{
  "users": {
    "{userId}": {
      "id": "string",
      "email": "string",
      "role": "citizen" | "worker" | "admin",
      "name": "string",
      "createdAt": number (timestamp),
      "isActive": boolean,
      "profilePicture": "string" (optional, local URI)
    }
  }
}
```

## How to Check Your Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **smartwastemanagement-c7500**
3. Click on **Realtime Database** in the left sidebar (NOT Firestore!)
4. You should see the data structure

## Database Rules

Make sure your Realtime Database rules allow authenticated users to read/write their data:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

For development/testing, you can use these simpler rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

⚠️ **Warning**: The development rules are less secure. Use them only for testing.

## Fingerprint Authentication Issue

The fingerprint authentication feature requires:

1. **Firebase Auth Session**: The user must have logged in with credentials at least once to create a Firebase Auth session
2. **Biometric Eligibility**: After successful login, the user is marked as eligible for biometric authentication

**If fingerprint shows "Session expired":**
- This means there's no active Firebase Auth session
- The user needs to login with credentials again to create a new session
- This is NOT a database issue - it's an authentication session issue

## User Data vs Authentication Session

- **Firebase Auth Session**: Created when user logs in with credentials. Persists across app restarts.
- **User Data in Database**: Stored at `users/{userId}` in Realtime Database. Contains user profile information.

These are separate:
- Fingerprint requires a Firebase Auth session (not user data in database)
- The app needs user data to determine the user's role and show the correct dashboard

## Troubleshooting

### Issue: Fingerprint shows "Session expired"

**Solution**: The user needs to login with credentials first to create a Firebase Auth session. This is normal behavior if:
- The user logged out
- The app data was cleared
- The session expired (rare)

### Issue: User data not found in database

**Solution**: 
1. Check database rules allow reads/writes
2. User data is created automatically when user registers
3. If missing, the app creates a fallback userData object

### Issue: Database is empty

**This is normal if:**
- No users have registered yet
- Database rules prevent viewing data

**To test:**
1. Register a new user in the app
2. Check the Realtime Database - you should see `users/{userId}` with the user data
