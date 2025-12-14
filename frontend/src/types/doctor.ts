/**
 * Consultation fee range
 */
export interface ConsultationFee {
  min: number;
  max: number;
}

/**
 * Doctor information details
 */
export interface DoctorInfo {
  specialization: string; // e.g., "neurology", "cardiology"
  licenseNumber: string; // Medical license number
  yearsOfExperience: number; // Years of experience
  education: string[]; // List of education/certifications
  hospital: string; // Current hospital/workplace
  consultationFee: ConsultationFee; // Consultation fee range
  bio: string; // Doctor biography/description
  rating: number; // Average rating (0-5)
  totalReviews: number; // Total number of reviews
  totalPatients: number; // Total patients treated
}

/**
 * Timestamp object from Firebase
 */
export interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Doctor user profile
 */
export interface Doctor {
  id: string; // Doctor ID
  email: string; // Email address
  fullName: string; // Full name
  phone: string; // Phone number
  dateOfBirth: string; // ISO date string
  gender: "male" | "female" | "other"; // Gender
  role: "doctor"; // User role (always "doctor")
  avatar: string; // Avatar URL
  address: string; // Full address
  createdAt: FirebaseTimestamp; // Creation timestamp
  updatedAt: FirebaseTimestamp; // Last update timestamp
  doctorInfo: DoctorInfo; // Doctor-specific information
}

/**
 * API response for single doctor
 */
export interface DoctorResponse {
  success: boolean;
  data: Doctor;
  message: string;
}

/**
 * API response for multiple doctors
 */
export interface DoctorsResponse {
  success: boolean;
  data: Doctor[];
  message: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Doctor search/filter params
 */
export interface DoctorFilters {
  specialization?: string;
  hospital?: string;
  minRating?: number;
  maxFee?: number;
  minFee?: number;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Doctor for display (simplified version)
 */
export interface DoctorCard {
  id: string;
  fullName: string;
  avatar: string;
  specialization: string;
  rating: number;
  totalReviews: number;
  consultationFee: ConsultationFee;
  hospital: string;
}
