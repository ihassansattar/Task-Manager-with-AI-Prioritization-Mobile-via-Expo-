import * as FileSystem from "expo-file-system";

// MinIO configuration from environment variables
const MINIO_CONFIG = {
  endpoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucket: process.env.MINIO_BUCKET,
  publicUrl: process.env.MINIO_PUBLIC_URL,
  useSSL: process.env.MINIO_USE_SSL === "true",
};

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

class MinIOService {
  private baseUrl: string;

  constructor() {
    const protocol = MINIO_CONFIG.useSSL ? "https" : "http";
    this.baseUrl = `${protocol}://${MINIO_CONFIG.endpoint}:${MINIO_CONFIG.port}`;
  }

  /**
   * Generate a unique filename for the uploaded image
   */
  private generateFileName(userId: string, extension: string): string {
    const timestamp = Date.now();
    return `avatars/${userId}-${timestamp}.${extension}`;
  }

  /**
   * Get the file extension from a URI or MIME type
   */
  private getFileExtension(uri: string, mimeType?: string): string {
    if (mimeType) {
      const mimeToExt: { [key: string]: string } = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
      };
      return mimeToExt[mimeType] || "jpg";
    }

    // Fallback to extracting from URI
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
      console.log("Starting profile image upload for user:", userId);
      console.log("Image URI:", imageUri);

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

      // Determine file extension
      const extension = this.getFileExtension(imageUri);
      const fileName = this.generateFileName(userId, extension);

      console.log("Generated filename:", fileName);

      // Convert base64 to binary data
      const binaryData = Uint8Array.from(atob(base64Data), (c) =>
        c.charCodeAt(0)
      );

      const uploadUrl = `${this.baseUrl}/${MINIO_CONFIG.bucket}/${fileName}`;

      console.log("Upload URL:", uploadUrl);

      // Upload using fetch with binary data
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: binaryData,
        headers: {
          "Content-Type": `image/${extension}`,
          "Content-Length": binaryData.length.toString(),
          "x-amz-acl": "public-read",
        },
      });

      console.log("Upload response status:", uploadResponse.status);

      if (uploadResponse.ok || uploadResponse.status === 200) {
        const publicUrl = `${MINIO_CONFIG.publicUrl}/${MINIO_CONFIG.bucket}/${fileName}`;
        console.log("Upload successful, public URL:", publicUrl);

        return {
          success: true,
          url: publicUrl,
        };
      } else {
        const errorText = await uploadResponse.text();
        console.error("Upload failed:", uploadResponse.status, errorText);

        return {
          success: false,
          error: `Upload failed: ${uploadResponse.status} ${errorText}`,
        };
      }
    } catch (error: any) {
      console.error("MinIO upload error:", error);
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
      // Extract filename from URL
      const urlParts = imageUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const fullPath = `${folder}/${fileName}`;

      const deleteUrl = `${this.baseUrl}/${MINIO_CONFIG.bucket}/${fullPath}`;

      const deleteResponse = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `AWS ${MINIO_CONFIG.accessKey}:${MINIO_CONFIG.secretKey}`,
        },
      });

      if (deleteResponse.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: `Delete failed: ${deleteResponse.status}`,
        };
      }
    } catch (error: any) {
      console.error("MinIO delete error:", error);
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
