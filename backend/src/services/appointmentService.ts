import { db } from "../config/firebase";
import { Appointment } from "../models/Appointment";

export class AppointmentService {
  // Create appointment
  async createAppointment(
    appointmentData: Partial<Appointment>
  ): Promise<Appointment> {
    const newAppointment: Appointment = {
      patientId: appointmentData.patientId!,
      doctorId: appointmentData.doctorId!,
      date: appointmentData.date!,
      timeSlot: appointmentData.timeSlot!,
      status: "pending",
      reason: appointmentData.reason!,
      notes: appointmentData.notes,
      fee: appointmentData.fee!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection("appointments").add(newAppointment);

    return { id: docRef.id, ...newAppointment };
  }

  // Get appointments by patient
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const snapshot = await db
      .collection("appointments")
      .where("patientId", "==", patientId)
      .orderBy("date", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  }

  // Get appointments by doctor
  async getAppointmentsByDoctor(
    doctorId: string,
    status?: string
  ): Promise<Appointment[]> {
    let query = db.collection("appointments").where("doctorId", "==", doctorId);

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.orderBy("date", "desc").get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  }

  // Update appointment status
  async updateAppointmentStatus(
    appointmentId: string,
    status: string,
    doctorNotes?: string,
    rejectionReason?: string
  ): Promise<Appointment> {
    const docRef = db.collection("appointments").doc(appointmentId);

    await docRef.update({
      status,
      ...(doctorNotes && { doctorNotes }),
      ...(rejectionReason && { rejectionReason }),
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as Appointment;
  }

  // Cancel appointment
  async cancelAppointment(appointmentId: string): Promise<void> {
    const docRef = db.collection("appointments").doc(appointmentId);

    await docRef.update({
      status: "cancelled",
      updatedAt: new Date(),
    });
  }
}
