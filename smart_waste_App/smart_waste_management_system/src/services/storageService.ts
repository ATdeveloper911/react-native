import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export const storageService = {
  /**
   * Upload an image to Firebase Storage
   * @param uri - Local file URI
   * @param path - Storage path (e.g., 'profile-pictures/user123.jpg')
   * @returns Download URL
   */
  async uploadImage(uri: string, path: string): Promise<string> {
    try {
      console.log('Starting image upload:', { uri, path });
      
      // Check if storage is available
      if (!storage) {
        throw new Error('Firebase Storage is not initialized');
      }

      // Create a reference to the file location
      const storageRef = ref(storage, path);
      console.log('Storage reference created:', storageRef.fullPath);

      // Convert image to blob using fetch (works with local file URIs in React Native)
      console.log('Converting image to blob...');
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);

      // Upload the file
      console.log('Uploading to Firebase Storage...');
      const uploadResult = await uploadBytes(storageRef, blob);
      console.log('Upload successful:', uploadResult.metadata.name);

      // Get the download URL
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more detailed error information
      let errorMessage = error.message || 'Failed to upload image';
      if (error.code === 'storage/unauthorized') {
        errorMessage = 'You do not have permission to upload files. Please check your Firebase Storage rules.';
      } else if (error.code === 'storage/canceled') {
        errorMessage = 'Upload was canceled.';
      } else if (error.code === 'storage/unknown') {
        errorMessage = 'Firebase Storage is not properly configured. Please check your Firebase project settings.';
      } else if (error.code === 'storage/invalid-argument') {
        errorMessage = 'Invalid file or path provided.';
      } else if (error.code === 'storage/invalid-checksum') {
        errorMessage = 'File corruption detected. Please try again.';
      } else if (error.code === 'storage/invalid-format') {
        errorMessage = 'Invalid file format. Please select a valid image file.';
      } else if (error.code === 'storage/invalid-url') {
        errorMessage = 'Invalid file URL. Please try selecting the image again.';
      } else if (error.code === 'storage/object-not-found') {
        errorMessage = 'File not found. Please try again.';
      } else if (error.code === 'storage/project-not-found') {
        errorMessage = 'Firebase project not found. Please check your configuration.';
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = 'Storage quota exceeded. Please contact support.';
      } else if (error.code === 'storage/unauthenticated') {
        errorMessage = 'User not authenticated. Please log in again.';
      } else if (error.code === 'storage/retry-limit-exceeded') {
        errorMessage = 'Upload failed after multiple attempts. Please check your internet connection.';
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete an image from Firebase Storage
   * @param path - Storage path or full URL
   */
  async deleteImage(pathOrUrl: string): Promise<void> {
    try {
      // If it's a full URL, extract the path
      let path = pathOrUrl;
      if (pathOrUrl.startsWith('https://')) {
        // Extract path from Firebase Storage URL
        const urlParts = pathOrUrl.split('/o/');
        if (urlParts.length > 1) {
          const encodedPath = urlParts[1].split('?')[0];
          path = decodeURIComponent(encodedPath);
        }
      }
      
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      console.log('Image deleted successfully:', path);
    } catch (error: any) {
      console.error('Error deleting image:', error);
      // Don't throw error if file doesn't exist
      if (error.code !== 'storage/object-not-found') {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    }
  },

  /**
   * Upload user profile picture
   * @param userId - User ID
   * @param uri - Local file URI
   * @returns Download URL
   */
  async uploadProfilePicture(userId: string, uri: string): Promise<string> {
    const path = `profile-pictures/${userId}/profile.jpg`;
    return this.uploadImage(uri, path);
  },
};
