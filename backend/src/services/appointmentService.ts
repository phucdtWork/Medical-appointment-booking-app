import { db } from "../config/firebase";
import { Appointment } from "../models/Appointment";
import { EmailService } from "./emailService";
import eventBus from "../utils/eventBus";

const emailService = new EmailService();

export class AppointmentService {
  // Create appointment
  async createAppointment(
    appointmentData: Partial<Appointment>
  ): Promise<Appointment> {
    // Prevent double-booking: check doctor's appointments on the same day
    const date = new Date(appointmentData.date as any);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const nextDay = new Date(dayStart);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingSnapshot = await db
      .collection("appointments")
      .where("doctorId", "==", appointmentData.doctorId)
      .where("date", ">=", dayStart)
      .where("date", "<", nextDay)
      .get();

    const requestedStart = appointmentData.timeSlot?.start;
    const conflict = existingSnapshot.docs.some((d) => {
      const data: any = d.data();
      return data.timeSlot?.start === requestedStart;
    });

    if (conflict) {
      const err: any = new Error("Selected time slot is already booked");
      err.status = 400;
      throw err;
    }

    // Build payload and only include optional fields when defined
    const payload: any = {
      patientId: appointmentData.patientId!,
      doctorId: appointmentData.doctorId!,
      date: new Date(appointmentData.date as any),
      timeSlot: appointmentData.timeSlot!,
      status: "pending",
      reason: appointmentData.reason!,
      fee: appointmentData.fee!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (appointmentData.notes !== undefined) {
      payload.notes = appointmentData.notes;
    }

    const docRef = await db.collection("appointments").add(payload);

    return { id: docRef.id, ...payload } as Appointment;
  }

  // Get appointments by patient
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const snapshot = await db
      .collection("appointments")
      .where("patientId", "==", patientId)
      .orderBy("date", "desc")
      .get();

    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    // attach doctor info for each appointment (batch fetch)
    const doctorIds = Array.from(
      new Set(appointments.map((a: any) => a.doctorId).filter(Boolean))
    );

    if (doctorIds.length === 0) {
      return appointments as Appointment[];
    }

    const doctorDocs = await Promise.all(
      doctorIds.map((did) => db.collection("users").doc(did).get())
    );

    const doctorMap: Record<string, any> = {};
    doctorDocs.forEach((dDoc) => {
      if (dDoc.exists) doctorMap[dDoc.id] = dDoc.data();
    });

    return appointments.map((a: any) => ({
      ...a,
      doctorInfo: doctorMap[a.doctorId] || null,
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

    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    // attach patient info for each appointment (batch fetch)
    const patientIds = Array.from(
      new Set(appointments.map((a: any) => a.patientId).filter(Boolean))
    );

    if (patientIds.length === 0) {
      return appointments as Appointment[];
    }

    const patientDocs = await Promise.all(
      patientIds.map((pid) => db.collection("users").doc(pid).get())
    );

    const patientMap: Record<string, any> = {};
    patientDocs.forEach((pDoc) => {
      if (pDoc.exists) patientMap[pDoc.id] = pDoc.data();
    });

    return appointments.map((a: any) => ({
      ...a,
      patientInfo: patientMap[a.patientId] || null,
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
    const updated = { id: updatedDoc.id, ...updatedDoc.data() } as Appointment;

    // If appointment completed, send a review reminder to patient (best-effort)
    try {
      if (status === "completed") {
        const apptData: any = updated;
        const patientId = apptData.patientId;
        const doctorId = apptData.doctorId;

        if (patientId) {
          const patientDoc = await db.collection("users").doc(patientId).get();
          const doctorDoc = await db.collection("users").doc(doctorId).get();

          const patientData: any = patientDoc.exists ? patientDoc.data() : null;
          const doctorData: any = doctorDoc.exists ? doctorDoc.data() : null;

          const patientEmail = patientData?.email;
          const patientName = patientData?.fullName || "";
          const doctorName =
            doctorData?.fullName ||
            doctorData?.doctorInfo?.hospital ||
            "Your doctor";
          const appointmentDate = apptData.date
            ? new Date(apptData.date).toLocaleString()
            : "";

          if (patientEmail) {
            // best-effort send email (don't block on failure)
            emailService
              .sendReviewReminder(
                patientEmail,
                patientName,
                doctorName,
                appointmentDate
              )
              .catch((err) => {
                console.error("Failed to send review reminder:", err);
              });
          }

          // Emit an event so real-time clients can show an in-app reminder
          try {
            eventBus.emit("appointment", {
              action: "completed",
              appointment: updated,
            });
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error("Error handling post-completion reminder:", err);
    }

    // If appointment is confirmed, auto-reject other pending appointments
    // that share the same doctor, date (same day) and time slot start.
    try {
      if (status === "confirmed") {
        const apptData: any = updated;
        const doctorId = apptData.doctorId;
        const dateVal = apptData.date ? new Date(apptData.date) : null;
        const slotStart = apptData.timeSlot?.start;

        if (doctorId && dateVal && slotStart) {
          const dayStart = new Date(dateVal);
          dayStart.setHours(0, 0, 0, 0);
          const nextDay = new Date(dayStart);
          nextDay.setDate(nextDay.getDate() + 1);

          const snapshot = await db
            .collection("appointments")
            .where("date", ">=", dayStart)
            .where("date", "<", nextDay)
            .get();

          const rejects: Promise<any>[] = [];

          snapshot.docs.forEach((d) => {
            if (d.id === updated.id) return; // skip the one just confirmed
            const data: any = d.data();
            if (
              data.doctorId === doctorId &&
              data.status === "pending" &&
              data.timeSlot?.start === slotStart
            ) {
              // mark as rejected
              rejects.push(
                db.collection("appointments").doc(d.id).update({
                  status: "rejected",
                  rejectionReason: "Time slot already confirmed",
                  updatedAt: new Date(),
                })
              );
              try {
                eventBus.emit("appointment", {
                  action: "updated",
                  appointment: { id: d.id, ...data, status: "rejected" },
                });
              } catch (e) {
                // ignore
              }
            }
          });

          if (rejects.length > 0) await Promise.all(rejects);
        }
      }
    } catch (err) {
      console.error("Error auto-rejecting conflicting appointments:", err);
    }

    return updated;
  }

  // Cancel appointment
  async cancelAppointment(appointmentId: string): Promise<Appointment> {
    const docRef = db.collection("appointments").doc(appointmentId);

    await docRef.update({
      status: "cancelled",
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...(updatedDoc.data() as any) } as Appointment;
  }

  // Get appointment by id
  async getAppointmentById(appointmentId: string): Promise<Appointment> {
    const docRef = db.collection("appointments").doc(appointmentId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error("Appointment not found");
    return { id: doc.id, ...(doc.data() as any) } as Appointment;
  }

  // Reschedule appointment (patient)
  async rescheduleAppointment(
    appointmentId: string,
    newDate: Date | string,
    newTimeSlot: { start: string; end: string }
  ): Promise<Appointment> {
    const docRef = db.collection("appointments").doc(appointmentId);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error("Appointment not found");

    const appt: any = doc.data();

    // Only allow reschedule when still pending and more than 24 hours before
    const currentDate = appt.date ? new Date(appt.date) : null;
    if (!currentDate) throw new Error("Invalid appointment date");

    const hoursUntil = (currentDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (appt.status !== "pending") {
      const err: any = new Error(
        "Only pending appointments can be rescheduled"
      );
      err.status = 400;
      throw err;
    }

    if (hoursUntil <= 24) {
      const err: any = new Error(
        "Cannot reschedule within 24 hours of appointment"
      );
      err.status = 400;
      throw err;
    }

    // Check for conflicts on the target day for the same doctor
    const doctorId = appt.doctorId;
    const targetDate = new Date(newDate as any);
    const tDayStart = new Date(targetDate);
    tDayStart.setHours(0, 0, 0, 0);
    const tNextDay = new Date(tDayStart);
    tNextDay.setDate(tNextDay.getDate() + 1);

    const existingSnapshot = await db
      .collection("appointments")
      .where("doctorId", "==", doctorId)
      .where("date", ">=", tDayStart)
      .where("date", "<", tNextDay)
      .get();

    const conflict = existingSnapshot.docs.some((d) => {
      if (d.id === appointmentId) return false; // ignore self
      const data: any = d.data();
      return data.timeSlot?.start === newTimeSlot.start;
    });

    if (conflict) {
      const err: any = new Error("Selected time slot is already booked");
      err.status = 400;
      throw err;
    }

    await docRef.update({
      date: new Date(newDate as any),
      timeSlot: newTimeSlot,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...(updatedDoc.data() as any) } as Appointment;
  }
}
