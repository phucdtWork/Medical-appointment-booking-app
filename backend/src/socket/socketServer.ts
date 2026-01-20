import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

export let io: Server;

export function initializeSocket(httpServer: HTTPServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ==================== APPOINTMENT ROOMS ====================

    // Doctor joins their appointment room to receive real-time updates
    socket.on("join:doctor:appointments", (doctorId: string) => {
      socket.join(`doctor:${doctorId}:appointments`);
      console.log(
        `Socket ${socket.id} joined doctor ${doctorId} appointments room`,
      );
    });

    // Patient joins their appointment room to receive real-time updates
    socket.on("join:patient:appointments", (patientId: string) => {
      socket.join(`patient:${patientId}:appointments`);
      console.log(
        `Socket ${socket.id} joined patient ${patientId} appointments room`,
      );
    });

    // Leave doctor appointments room
    socket.on("leave:doctor:appointments", (doctorId: string) => {
      socket.leave(`doctor:${doctorId}:appointments`);
      console.log(
        `Socket ${socket.id} left doctor ${doctorId} appointments room`,
      );
    });

    // Leave patient appointments room
    socket.on("leave:patient:appointments", (patientId: string) => {
      socket.leave(`patient:${patientId}:appointments`);
      console.log(
        `Socket ${socket.id} left patient ${patientId} appointments room`,
      );
    });

    // ==================== SLOT MANAGEMENT (Existing) ====================

    // Join room for specific doctor's availability
    socket.on("watch:doctor:slots", (doctorId: string) => {
      socket.join(`doctor:${doctorId}:slots`);
      console.log(`Socket ${socket.id} watching slots for doctor ${doctorId}`);
    });

    // User starts booking a slot (temporary lock)
    socket.on("slot:booking:start", ({ doctorId, date, slotStart }) => {
      const slotKey = `${doctorId}_${date}_${slotStart}`;

      // Notify others that this slot is being booked
      socket.to(`doctor:${doctorId}:slots`).emit("slot:status:changed", {
        slotKey,
        isBeingBooked: true,
        userId: socket.id,
      });
    });

    // User cancels booking
    socket.on("slot:booking:cancel", ({ doctorId, date, slotStart }) => {
      const slotKey = `${doctorId}_${date}_${slotStart}`;

      socket.to(`doctor:${doctorId}:slots`).emit("slot:status:changed", {
        slotKey,
        isBeingBooked: false,
      });
    });

    // User completes booking
    socket.on("slot:booking:complete", ({ doctorId, date, slotStart }) => {
      const slotKey = `${doctorId}_${date}_${slotStart}`;

      // Notify everyone that slot is now booked
      io.to(`doctor:${doctorId}:slots`).emit("slot:booked", {
        slotKey,
        date,
        slotStart,
      });
    });

    // Leave room
    socket.on("unwatch:doctor:slots", (doctorId: string) => {
      socket.leave(`doctor:${doctorId}:slots`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

// ==================== HELPER FUNCTIONS ====================

// Emit schedule update to doctor
export function emitScheduleUpdate(doctorId: string) {
  if (io) {
    io.to(`doctor:${doctorId}:slots`).emit("schedule:updated", { doctorId });
  }
}

// Emit new appointment to doctor (real-time booking notification)
export function emitNewAppointment(doctorId: string, appointment: any) {
  if (io) {
    io.to(`doctor:${doctorId}:appointments`).emit("appointment:created", {
      appointment,
      timestamp: new Date(),
    });
  }
}

// Emit appointment status update to both doctor and patient
export function emitAppointmentStatusUpdate(
  appointmentId: string,
  doctorId: string,
  patientId: string,
  appointment: any,
) {
  if (io) {
    // Notify doctor
    io.to(`doctor:${doctorId}:appointments`).emit(
      "appointment:status:updated",
      {
        appointmentId,
        appointment,
        timestamp: new Date(),
      },
    );

    // Notify patient
    io.to(`patient:${patientId}:appointments`).emit(
      "appointment:status:updated",
      {
        appointmentId,
        appointment,
        timestamp: new Date(),
      },
    );
  }
}

// Emit appointment rescheduled to doctor and patient
export function emitAppointmentRescheduled(
  appointmentId: string,
  doctorId: string,
  patientId: string,
  appointment: any,
) {
  if (io) {
    // Notify doctor
    io.to(`doctor:${doctorId}:appointments`).emit("appointment:rescheduled", {
      appointmentId,
      appointment,
      timestamp: new Date(),
    });

    // Notify patient
    io.to(`patient:${patientId}:appointments`).emit("appointment:rescheduled", {
      appointmentId,
      appointment,
      timestamp: new Date(),
    });
  }
}

// Emit appointment cancelled to doctor and patient
export function emitAppointmentCancelled(
  appointmentId: string,
  doctorId: string,
  patientId: string,
  reason?: string,
) {
  if (io) {
    // Notify doctor
    io.to(`doctor:${doctorId}:appointments`).emit("appointment:cancelled", {
      appointmentId,
      cancelledBy: "patient", // or 'doctor'
      reason,
      timestamp: new Date(),
    });

    // Notify patient
    io.to(`patient:${patientId}:appointments`).emit("appointment:cancelled", {
      appointmentId,
      cancelledBy: "doctor", // or 'patient'
      reason,
      timestamp: new Date(),
    });
  }
}
