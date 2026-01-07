export interface Review {
  id?: string;
  doctorId: string;
  patientId: string;
  appointmentId?: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface ReviewCreate {
  doctorId: string;
  patientId: string;
  appointmentId?: string;
  rating: number;
  comment?: string;
}
