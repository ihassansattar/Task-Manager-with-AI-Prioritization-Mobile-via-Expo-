import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { minioService } from '../lib/minio';

interface UseImageUploadReturn {
  uploading: boolean;
  uploadImage: (userId: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  selectImage: () => Promise<{ success: boolean; uri?: string; error?: string }>;
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Camera and photo library permissions are required to upload profile pictures.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const selectImage = async (): Promise<{ success: boolean; uri?: string; error?: string }> => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        return { success: false, error: 'Permissions not granted' };
      }

      return new Promise((resolve) => {
        Alert.alert(
          'Select Image',
          'Choose how you want to select your profile picture',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve({ success: false }) },
            {
              text: 'Camera',
              onPress: async () => {
                try {
                  const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                    base64: false,
                  });

                  if (!result.canceled && result.assets && result.assets.length > 0) {
                    resolve({ success: true, uri: result.assets[0].uri });
                  } else {
                    resolve({ success: false });
                  }
                } catch (error: any) {
                  console.error('Camera error:', error);
                  resolve({ success: false, error: error.message });
                }
              },
            },
            {
              text: 'Gallery',
              onPress: async () => {
                try {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                    base64: false,
                  });

                  if (!result.canceled && result.assets && result.assets.length > 0) {
                    resolve({ success: true, uri: result.assets[0].uri });
                  } else {
                    resolve({ success: false });
                  }
                } catch (error: any) {
                  console.error('Gallery error:', error);
                  resolve({ success: false, error: error.message });
                }
              },
            },
          ]
        );
      });
    } catch (error: any) {
      console.error('Select image error:', error);
      return { success: false, error: error.message };
    }
  };

  const uploadImage = async (userId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      setUploading(true);

      // First, select the image
      const selectResult = await selectImage();
      if (!selectResult.success || !selectResult.uri) {
        return { success: false, error: selectResult.error || 'No image selected' };
      }

      console.log('Selected image:', selectResult.uri);

      // Upload the image to MinIO
      const uploadResult = await minioService.uploadProfileImage(userId, selectResult.uri);

      if (uploadResult.success && uploadResult.url) {
        console.log('Image uploaded successfully:', uploadResult.url);
        return {
          success: true,
          url: uploadResult.url,
        };
      } else {
        console.error('Upload failed:', uploadResult.error);
        return {
          success: false,
          error: uploadResult.error || 'Upload failed',
        };
      }

    } catch (error: any) {
      console.error('Upload image error:', error);
      return {
        success: false,
        error: error.message || 'Upload failed',
      };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadImage,
    selectImage,
  };
}