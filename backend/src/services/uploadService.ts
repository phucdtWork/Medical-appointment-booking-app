// backend/src/services/uploadService.ts
import cloudinary from "../config/cloudinary";
import fs from "fs";
import path from "path";

export interface UploadedFile {
  secure_url: string;
  public_id: string;
}

export class UploadService {
  // Upload single file from multer (Cloudinary Storage)
  async uploadFile(file: Express.Multer.File): Promise<UploadedFile> {
    if (!file) {
      throw new Error("No file provided");
    }

    // When using CloudinaryStorage, the file object contains the URL and public_id
    return {
      secure_url: (file as any).path,
      public_id: (file as any).filename,
    };
  }

  // Upload from buffer to Cloudinary
  async uploadFileFromBuffer(
    buffer: Buffer,
    folder: string,
    filename: string
  ): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: filename,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Delete file by public_id
  async deleteFile(publicId: string): Promise<void> {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file from Cloudinary");
    }
  }

  // Upload multiple files
  async uploadFiles(files: Express.Multer.File[]): Promise<UploadedFile[]> {
    if (!files || files.length === 0) {
      return [];
    }

    return files.map((file: any) => ({
      secure_url: file.path,
      public_id: file.filename,
    }));
  }

  // Extract public_id from URL
  extractPublicId(url: string): string {
    if (!url) return "";
    const matches = url.match(/\/([^/]+)\.[a-z]+$/i);
    return matches ? matches[1] : "";
  }

  // Get optimized URL
  getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
    }
  ): string {
    return cloudinary.url(publicId, {
      width: options?.width || 500,
      height: options?.height || 500,
      crop: "fill",
      quality: options?.quality || "auto",
      fetch_format: "auto",
    });
  }
}

export default new UploadService();
