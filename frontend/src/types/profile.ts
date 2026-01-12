/**
 * Profile-related types for personal, medical, and professional information
 */

/**
 * Personal Information
 */
export interface PersonalInfo {
  fullName: string;
  dateOfBirth?: Date | string;
  gender?: "male" | "female" | "other";
  avatar?: string;
}

/**
 * Contact Information
 */
export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
}

/**
 * Medical Information
 */
export interface MedicalInfo {
  medicalHistory?: string[];
  allergies?: string[];
}

/**
 * Professional Profile Information (for doctors)
 */
export interface ProfessionalInfo {
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  education: string[];
  hospital: string;
  bio: string;
  minFee?: number;
  maxFee?: number;
}

/**
 * Doctor Statistics
 */
export interface DoctorStatistics {
  rating: number;
  totalReviews: number;
  totalPatients: number;
}

/**
 * Complete Patient Profile
 */
export interface PatientProfile {
  id: string;
  // Personal info
  fullName: string;
  dateOfBirth?: Date | string;
  gender?: "male" | "female" | "other";
  avatar?: string;
  // Contact info
  email: string;
  phone: string;
  address?: string;
  // Medical info
  medicalHistory?: string[];
  allergies?: string[];
  // Meta
  role: "patient";
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Complete Doctor Profile
 */
export interface DoctorProfile {
  id: string;
  // Personal info
  fullName: string;
  dateOfBirth?: Date | string;
  gender?: "male" | "female" | "other";
  avatar?: string;
  // Contact info
  email: string;
  phone: string;
  address?: string;
  // Professional info
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  education: string[];
  hospital: string;
  bio: string;
  // Doctor statistics
  rating: number;
  totalReviews: number;
  totalPatients: number;
  // Doctor info object (for compatibility)
  doctorInfo?: {
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    education: string[];
    hospital: string;
    bio: string;
    rating: number;
    totalReviews: number;
    totalPatients: number;
  };
  // Meta
  role: "doctor";
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * User Profile (can be either patient or doctor)
 */
export type UserProfile = PatientProfile | DoctorProfile;

/**
 * Profile Form Data
 */
export interface ProfileFormData {
  // Personal Info
  fullName: string;
  dateOfBirth?: Date | string;
  gender?: "male" | "female" | "other";
  avatar?: string;

  // Contact Info
  email: string;
  phone: string;
  address?: string;

  // Medical Info (patient only)
  medicalHistory?: string[];
  allergies?: string[];

  // Professional Info (doctor only)
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  education?: string[];
  hospital?: string;
  bio?: string;
  minFee?: number;
  maxFee?: number;

  // Doctor Statistics
  rating?: number;
  totalReviews?: number;
  totalPatients?: number;
}

/**
 * Profile Update Request
 */
export interface UpdateProfileRequest {
  personalInfo?: Partial<PersonalInfo>;
  contactInfo?: Partial<ContactInfo>;
  medicalInfo?: Partial<MedicalInfo>;
  professionalInfo?: Partial<ProfessionalInfo>;
}

/**
 * Profile Update Response
 */
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
  error?: string;
}

/**
 * Profile Validation Errors
 */
export interface ProfileValidationErrors {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  allergies?: string;
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: string;
  education?: string;
  hospital?: string;
  bio?: string;
  minFee?: string;
  maxFee?: string;
}
