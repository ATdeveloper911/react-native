# Database Permissions Fix

## Issue
UserData is not loading from Firebase Realtime Database after login/signup, causing timeout errors.

## Root Cause
This is likely due to Firebase Realtime Database security rules preventing reads/writes.

## Solution

### Step 1: Check Firebase Realtime Database Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **smartwastemanagement-c7500**
3. Click on **Realtime Database** in the left sidebar
4. Click on the **Rules** tab
5. Check your current rules

### Step 2: Update Database Rules

If your rules are too restrictive, update them to allow authenticated users to read/write their own data:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "bins": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    "tasks": {
      ".read": "auth != null",
      ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || root.child('users').child(auth.uid).child('role').val() === 'worker')"
    },
    "reports": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### Step 3: Temporary Development Rules (For Testing Only)

⚠️ **WARNING**: Only use this for development/testing. Never use in production!

**Option A: Open Access (No Security - Development Only)**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Option B: Authenticated Users Only**
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

⚠️ **CRITICAL SECURITY WARNING**: 
- Option A (`.read: true, .write: true`) removes ALL security - anyone can read/write your entire database
- Only use Option A for initial development/testing
- Switch to secure rules (Step 2) before deploying to production
- Never commit these open rules to production

### Step 4: Verify Database Structure

Make sure your database structure is:
```
users/
  {userId}/
    id: string
    email: string
    role: string
    name: string
    createdAt: number
    isActive: boolean
```

## Fallback Mechanism

The app now includes a fallback mechanism:
- If userData is not found in the database, it creates a minimal userData object from the Firebase user
- Default role is set to 'citizen'
- This allows the app to continue working even if database read fails

## Testing

After updating rules:
1. Try logging in again
2. Check console logs for:
   - "✅ User data found" - Success
   - "❌ User data not found" - Still an issue
   - "⚠️ Permission denied" - Rules need updating

## Debugging

Check the console logs for:
- Database path being used: `users/{userId}`
- Permission errors
- Data structure mismatches

If issues persist, check:
1. Database URL is correct in `firebase.ts`
2. User is properly authenticated
3. Database rules allow the operation
4. Data was actually written to the database

