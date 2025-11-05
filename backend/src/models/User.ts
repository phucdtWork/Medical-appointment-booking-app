export interface User {
  id?: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  role: "patient" | "doctor";
  avatar?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;

  medicalHistory?: string[];
  allergies?: string[];

  // Doctor specific
  doctorInfo?: DoctorInfo;
}

export interface DoctorInfo {
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
  education: string[];
  hospital: string;
  consultationFee: {
    min: number;
    max: number;
  };
  bio: string;
  rating: number;
  totalReviews: number;
  totalPatients: number;
}
