import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

// MinIO configuration from Expo Constants
const MINIO_CONFIG = {
  endpoint:
    Constants.expoConfig?.extra?.MINIO_ENDPOINT || process.env.MINIO_ENDPOINT,
  port: Constants.expoConfig?.extra?.MINIO_PORT || process.env.MINIO_PORT,
  bucket: Constants.expoConfig?.extra?.MINIO_BUCKET || process.env.MINIO_BUCKET,
  publicUrl:
    Constants.expoConfig?.extra?.MINIO_PUBLIC_URL ||
    process.env.MINIO_PUBLIC_URL,
};

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

class MinIOService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `http://${MINIO_CONFIG.endpoint}:${MINIO_CONFIG.port}`;
  }

  /**
   * Generate a unique filename for the uploaded image
   */
  private generateFileName(userId: string, extension: string): string {
    return `avatars/${userId}.${extension}`;
  }

  /**
   * Get the file extension from a URI or MIME type
   */
  private getFileExtension(uri: string): string {
    const extension = uri.split(".").pop()?.toLowerCase();
    return extension &&
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)
      ? extension
      : "jpg";
  }

  /**
   * Upload profile image to MinIO bucket
   */
  async uploadProfileImage(
    userId: string,
    imageUri: string
  ): Promise<UploadResponse> {
    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        return { success: false, error: "File does not exist" };
      }

      // Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!base64Data) {
        return { success: false, error: "Failed to read image data" };
      }

      // Determine file extension and generate filename
      const extension = this.getFileExtension(imageUri);
      const fileName = this.generateFileName(userId, extension);
      const contentType = `image/${extension}`;

      // Convert base64 to binary data
      const binaryData = Uint8Array.from(atob(base64Data), (c) =>
        c.charCodeAt(0)
      );

      // Upload URL
      const uploadUrl = `${this.baseUrl}/${MINIO_CONFIG.bucket}/avatars/${fileName}`;

      // Upload using fetch
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: binaryData,
        headers: {
          "Content-Type": contentType,
          "Content-Length": binaryData.length.toString(),
        },
      });

      if (uploadResponse.ok) {
        const publicUrl = `${MINIO_CONFIG.publicUrl}/${MINIO_CONFIG.bucket}/avatars/${fileName}`;
        return {
          success: true,
          url: publicUrl,
        };
      } else {
        const errorText = await uploadResponse.text();
        return {
          success: false,
          error: `Upload failed: ${uploadResponse.status} ${errorText}`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Upload failed",
      };
    }
  }

  /**
   * Delete profile image from MinIO bucket
   */
  async deleteProfileImage(
    imageUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];

      const deleteUrl = `${this.baseUrl}/${MINIO_CONFIG.bucket}/${folder}/${fileName}`;

      const deleteResponse = await fetch(deleteUrl, {
        method: "DELETE",
      });

      return {
        success: deleteResponse.ok,
        error: !deleteResponse.ok
          ? `Delete failed: ${deleteResponse.status}`
          : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Delete failed",
      };
    }
  }

  /**
   * Get public URL for an image
   */
  getPublicUrl(fileName: string): string {
    return `${MINIO_CONFIG.publicUrl}/${MINIO_CONFIG.bucket}/${fileName}`;
  }
}

export const minioService = new MinIOService();
export default minioService;
