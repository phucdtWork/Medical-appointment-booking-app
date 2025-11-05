export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  date: Date;
  timeSlot: {
    start: string;
    end: string;
  };
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled";
  reason: string;
  notes?: string;
  patientNotes?: string;
  doctorNotes?: string;
  rejectionReason?: string;
  fee: number;
  createdAt: Date;
  updatedAt: Date;
}
