# Setup Instructions

## Initial Setup Complete ✅

The Expo app has been successfully initialized with the following components:

### ✅ Completed Features

1. **Project Structure**
   - Expo TypeScript project initialized
   - Organized folder structure (src/components, screens, services, etc.)
   - Firebase configuration integrated

2. **Authentication**
   - Firebase Auth with email/password
   - Role-based authentication (Citizen, Worker, Admin)
   - Login and Register screens with navigation

3. **Navigation**
   - Role-based navigation system
   - Bottom tabs for Citizens
   - Stack navigation for Workers
   - Drawer navigation for Admins

4. **Citizen Features**
   - Real-time bin map with color-coded markers
   - Issue reporting with photo upload
   - Educational content screen

5. **Worker Features**
   - Task dashboard
   - Task detail screen
   - Route visualization with maps

6. **Admin Features**
   - Dashboard with statistics
   - Bin management screen
   - Placeholder screens for routes and reports

7. **Services**
   - Firebase Realtime Database integration
   - Offline support with AsyncStorage
   - Push notification setup
   - Network state monitoring

## Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Google Maps API Key
Update `app.json`:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

### 3. Set Up Firebase
- Ensure Firebase Realtime Database is enabled
- Set up database rules
- Configure Cloud Storage for report photos
- Set up Cloud Messaging for push notifications

### 4. Create Assets
Create placeholder images in the `assets` folder:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)
- `notification-icon.png` (96x96)

### 5. Run the App
```bash
npm start
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for web

## Firebase Database Rules

Set up these rules in Firebase Realtime Database:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
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

## Testing the App

1. **Register a new user** with role "citizen", "worker", or "admin"
2. **Login** to see role-based navigation
3. **Test offline mode** by disabling network and submitting a report
4. **Check real-time updates** by modifying bin data in Firebase console

## Known Limitations

- Google Maps requires API key configuration
- Push notifications need FCM setup in Firebase
- Some admin features (routes, reports management) are placeholder screens
- Asset images need to be created

## Troubleshooting

### Firebase Connection Issues
- Verify `google-services.json` is in project root
- Check Firebase configuration in `src/config/firebase.ts`
- Ensure Firebase project has Realtime Database enabled

### Maps Not Loading
- Verify Google Maps API key is set in `app.json`
- Check API key has proper restrictions/quotas
- Ensure billing is enabled for Google Cloud project

### Build Errors
- Run `npx expo install --fix` to fix dependency versions
- Clear cache: `npx expo start -c`
- Delete `node_modules` and reinstall

