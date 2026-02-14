# Admin User Setup

## Admin User Created

An admin user has been created with the following credentials:

- **Name**: Minahil Imran
- **Email**: asadullahkamboh111@gmail.com
- **Password**: 123456
- **Role**: admin

## How to Create Additional Admin Users

### Option 1: Using the Script (Recommended)

Run the script to create an admin user:

```bash
node scripts/createAdminUser.mjs
```

To create a different user, edit `scripts/createAdminUser.mjs` and update:
- `email`: User's email address
- `password`: User's password
- `name`: User's full name
- `role`: Set to `'admin'` for admin access

### Option 2: Using Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `smartwastemanagement-c7500`
3. **Navigate to Authentication**:
   - Click on "Authentication" in the left sidebar
   - Make sure "Email/Password" sign-in method is enabled
4. **Create User**:
   - Click on "Users" tab
   - Click "Add user"
   - Enter email and password
   - Click "Add user"
5. **Create User Document in Realtime Database**:
   - Go to "Realtime Database" in the left sidebar
   - Navigate to `users/{userId}` (use the User UID from Authentication)
   - Add the following structure:
     ```json
     {
       "id": "{userId}",
       "email": "user@example.com",
       "role": "admin",
       "name": "User Name",
       "createdAt": 1234567890,
       "isActive": true
     }
     ```

### Option 3: Using the App (After First Admin is Created)

Once you have one admin user, you can use the Admin Portal in the app to create additional users (if this feature is implemented).

## Login Credentials

After setup, you can login with:
- **Email**: asadullahkamboh111@gmail.com
- **Password**: 123456

## Important Notes

- Make sure Realtime Database is enabled in Firebase Console
- Make sure Authentication is enabled with Email/Password method
- The role must be exactly `"admin"` (lowercase) for admin access
- User data is stored in Realtime Database under `users/{userId}`

## Troubleshooting

If the script fails with "email-already-in-use":
- The user already exists in Firebase Authentication
- You can update the role manually in Realtime Database
- Or delete the user from Authentication and run the script again

