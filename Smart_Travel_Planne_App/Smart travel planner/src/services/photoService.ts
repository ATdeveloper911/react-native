import * as ImagePicker from 'expo-image-picker';
import { Alert, AlertButton } from 'react-native';

export const photoService = {
  // Get image picker options
  getImagePickerOptions: (): ImagePicker.ImagePickerOptions => ({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 0.8,
  }),

  // Request camera permissions
  requestCameraPermissions: async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  },

  // Request media library permissions
  requestMediaLibraryPermissions: async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      return false;
    }
  },

  // Launch image picker from camera
  pickImageFromCamera: async (): Promise<{ success: boolean; uri?: string; error?: string }> => {
    try {
      const hasPermission = await photoService.requestCameraPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Camera permission is required to take photos' };
      }

      const result = await ImagePicker.launchCameraAsync(photoService.getImagePickerOptions());
      
      if (result.canceled || !result.assets[0]) {
        return { success: false, error: 'No image selected' };
      }

      return { success: true, uri: result.assets[0].uri };
    } catch (error: any) {
      console.error('Error picking image from camera:', error);
      return { success: false, error: error.message || 'Failed to take photo' };
    }
  },

  // Launch image picker from library
  pickImageFromLibrary: async (): Promise<{ success: boolean; uri?: string; error?: string }> => {
    try {
      const hasPermission = await photoService.requestMediaLibraryPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Photo library permission is required to select photos' };
      }

      const result = await ImagePicker.launchImageLibraryAsync(photoService.getImagePickerOptions());
      
      if (result.canceled || !result.assets[0]) {
        return { success: false, error: 'No image selected' };
      }

      return { success: true, uri: result.assets[0].uri };
    } catch (error: any) {
      console.error('Error picking image from library:', error);
      return { success: false, error: error.message || 'Failed to select photo' };
    }
  },

  // Show image picker options
  showImagePickerOptions: (onCamera: () => void, onLibrary: () => void, onRemove?: () => void) => {
    const options: AlertButton[] = [
      { text: 'Cancel', style: 'cancel' as const },
      { text: 'Camera', onPress: onCamera },
      { text: 'Photo Library', onPress: onLibrary },
    ];

    if (onRemove) {
      options.push({ text: 'Remove Picture', onPress: onRemove, style: 'destructive' as const });
    }

    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to select your profile picture',
      options
    );
  },

  // Convert local URI to data URL (same approach as mind_space_app)
  // For now, we'll store the local URI directly
  // In production, you could integrate with free services like Cloudinary, Imgur, etc.
  convertToDataURL: async (uri: string): Promise<string> => {
    try {
      // Option 1: Use local URI directly (works for local development)
      // Note: This won't persist across app reinstalls, but matches mind_space_app approach
      return uri;
    } catch (error) {
      console.error('Error converting image to data URL:', error);
      throw error;
    }
  },
};
