// backend/src/services/uploadService.ts
import cloudinary from "../config/cloudinary";

export class UploadService {
  // Upload single file
  async uploadFile(file: Express.Multer.File): Promise<string> {
    return (file as any).path;
  }

  // Delete file
  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  // Upload multiple files
  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    return files.map((file: any) => file.path);
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
