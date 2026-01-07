export interface TimeSlot {
  start: string;
  end: string;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "completed"
  | "cancelled";

export interface PatientInfo {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DoctorInfo {
  id: string;
  fullName?: string;
  specialty?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO date string
  timeSlot: TimeSlot;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  patientNotes?: string;
  doctorNotes?: string;
  rejectionReason?: string;
  fee?: number;
  createdAt?: string;
  updatedAt?: string;
  patientInfo?: PatientInfo;
  doctorInfo?: DoctorInfo;
}

export interface AppointmentList {
  items: Appointment[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export default Appointment;
