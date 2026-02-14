# Manual Admin User Setup Instructions

Since the script requires additional setup, here's how to manually create the admin user:

## Admin User Details

- **Name**: Minahil Imran
- **Email**: asadullahkamboh111@gmail.com
- **Password**: 123456
- **Role**: admin

## Step-by-Step Instructions

### Step 1: Create User in Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **smartwastemanagement-c7500**
3. Click on **Authentication** in the left sidebar
4. If not enabled, click **Get Started** and enable **Email/Password** sign-in method
5. Click on the **Users** tab
6. Click **Add user** button
7. Enter:
   - **Email**: `asadullahkamboh111@gmail.com`
   - **Password**: `123456`
8. Click **Add user**
9. **Copy the User UID** (you'll need this for Step 2)

### Step 2: Create User Document in Realtime Database

1. In Firebase Console, click on **Realtime Database** in the left sidebar
2. If not created, click **Create Database** and choose your region
3. Set security rules to allow writes (temporarily for setup):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   ⚠️ **Important**: Change these rules back to secure rules after setup!

4. Click on the database root
5. Click the **+** button to add a new node
6. Name it: `users`
7. Click on `users`, then click **+** again
8. Name it with the **User UID** you copied from Step 1
9. Add the following fields by clicking **+** for each:

   | Field Name | Type | Value |
   |------------|------|-------|
   | `id` | string | (paste the User UID) |
   | `email` | string | `asadullahkamboh111@gmail.com` |
   | `role` | string | `admin` |
   | `name` | string | `Minahil Imran` |
   | `createdAt` | number | `1737129600000` (or current timestamp) |
   | `isActive` | boolean | `true` |

10. Click **Save**

### Step 3: Verify Setup

1. Go back to **Authentication** > **Users**
2. Verify the user `asadullahkamboh111@gmail.com` exists
3. Go to **Realtime Database** > `users` > `{userId}`
4. Verify all fields are correct, especially `role: "admin"`

### Step 4: Update Security Rules (Important!)

After creating the user, update your Realtime Database rules for security:

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

## Login

After setup, you can login to the app with:
- **Email**: `asadullahkamboh111@gmail.com`
- **Password**: `123456`

You should be redirected to the Admin dashboard.

## Troubleshooting

- **Can't see Realtime Database**: Make sure it's enabled in Firebase Console
- **Can't write to database**: Temporarily set rules to allow writes (remember to change back!)
- **User not recognized as admin**: Double-check the `role` field is exactly `"admin"` (lowercase, with quotes)

