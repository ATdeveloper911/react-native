# Firebase Storage Rules Configuration

To fix the Firebase Storage upload error, you need to configure Storage Rules in your Firebase Console.

## Steps to Configure Storage Rules:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `smartwastemanagement-c7500`

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click on the "Rules" tab (at the top)

3. **Set the Storage Rules**

   Copy and paste the following rules:

   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Allow authenticated users to upload profile pictures
       match /profile-pictures/{userId}/{fileName} {
         // Allow read: anyone can read (for displaying profile pictures)
         allow read: if true;
         // Allow write: only the authenticated user can upload/delete their own profile picture
         allow write: if request.auth != null && request.auth.uid == userId
           && request.resource.size < 5 * 1024 * 1024 // 5MB limit
           && request.resource.contentType.matches('image/.*');
       }
       
       // Allow authenticated users to upload report photos
       match /reports/{reportId}/{fileName} {
         // Allow read: authenticated users only
         allow read: if request.auth != null;
         // Allow write: authenticated users can upload report photos
         allow write: if request.auth != null
           && request.resource.size < 10 * 1024 * 1024 // 10MB limit
           && request.resource.contentType.matches('image/.*');
       }
       
       // Deny all other access
       match /{allPaths=**} {
         allow read, write: if false;
       }
     }
   }
   ```

4. **Publish the Rules**
   - Click "Publish" button to save the rules
   - Rules will be active immediately

## Rule Explanation:

- **Profile Pictures**: 
  - Users can only upload/delete their own profile pictures (matched by userId)
  - File size limit: 5MB
  - Only image files allowed
  - Anyone can read (to display profile pictures)

- **Report Photos**:
  - Authenticated users can upload report photos
  - File size limit: 10MB
  - Only image files allowed
  - Only authenticated users can read

- **All other paths**: Denied by default

## Testing:

After setting up the rules, try uploading a profile picture again. The upload should work now!

## Important Notes:

- Make sure the user is authenticated before uploading
- File size limits are enforced (5MB for profile pictures, 10MB for reports)
- Only image files are allowed
- Profile pictures must be in the path format: `profile-pictures/{userId}/{fileName}`
