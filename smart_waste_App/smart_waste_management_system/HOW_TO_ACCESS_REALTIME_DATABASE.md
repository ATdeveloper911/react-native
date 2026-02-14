# How to Access Realtime Database Rules (Not Firestore)

## ⚠️ Important: You're Currently in Firestore, But Need Realtime Database

The error you're seeing is because you're in **Firestore Rules**, but your project uses **Realtime Database**. These are two different Firebase services with different rule formats.

## Step-by-Step: Switch to Realtime Database

### Step 1: Check if Realtime Database Exists

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **smartwastemanagement-c7500**
3. In the left sidebar, look for:
   - **"Realtime Database"** (what you need)
   - **"Firestore Database"** (what you're currently in - wrong one)

### Step 2: If Realtime Database Doesn't Exist, Create It

If you don't see "Realtime Database" in the sidebar:

1. Click **"Build"** in the left menu
2. Click **"Realtime Database"**
3. Click **"Create Database"**
4. Choose your region (e.g., `us-central1` or closest to you)
5. Choose **"Start in test mode"** (this will give you open rules temporarily)
6. Click **"Enable"**

### Step 3: Access Realtime Database Rules

1. Click **"Realtime Database"** in the left sidebar
2. Click the **"Rules"** tab at the top
3. You should see a JSON editor (NOT the code-like syntax you saw in Firestore)

### Step 4: Paste These Rules

Replace everything in the Rules editor with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Step 5: Publish

1. Click **"Publish"** button
2. Confirm the changes

## Visual Difference

**Firestore Rules** (what you saw - WRONG):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    ...
  }
}
```

**Realtime Database Rules** (what you need - CORRECT):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Your Project Uses Realtime Database

Your Firebase config shows:
- Database URL: `https://smartwastemanagement-c7500-default-rtdb.firebaseio.com`
- This is a **Realtime Database** URL (ends with `.firebaseio.com`)
- Your code uses `firebase/database` (Realtime Database), not `firebase/firestore`

## After Setting Rules

Once you've set the Realtime Database rules:
1. Try logging in again
2. The userData loading should work
3. Check console logs for success messages

