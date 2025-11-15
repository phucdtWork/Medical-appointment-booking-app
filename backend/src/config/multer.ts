// backend/src/config/multer.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

// Avatar storage
export const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "medibook/avatars", // Folder trong Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 500, height: 500, crop: "fill" }, // Resize tự động
    ],
  } as any,
});

// Medical records storage
export const medicalRecordStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "medibook/medical-records",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  } as any,
});

// Doctor certificates storage
export const certificateStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "medibook/certificates",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  } as any,
});

// Multer middleware
export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadMedicalRecord = multer({
  storage: medicalRecordStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const uploadCertificate = multer({
  storage: certificateStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
