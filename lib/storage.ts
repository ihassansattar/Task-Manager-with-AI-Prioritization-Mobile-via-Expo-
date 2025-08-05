import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

class StorageService {
  private getFileExtension(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();
    return extension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
      ? extension
      : 'jpg';
  }

  private generateFileName(userId: string, extension: string): string {
    const timestamp = Date.now();
    return `avatars/${userId}-${timestamp}.${extension}`;
  }

  async uploadProfileImage(userId: string, imageUri: string): Promise<UploadResponse> {
    try {
      const extension = this.getFileExtension(imageUri);
      const fileName = this.generateFileName(userId, extension);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 }), {
          contentType: `image/${extension}`,
          upsert: false,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(data.path);

      return { success: true, url: publicUrlData.publicUrl };
    } catch (error: any) {
      return { success: false, error: error.message || 'Upload failed' };
    }
  }
}

export const storageService = new StorageService();
