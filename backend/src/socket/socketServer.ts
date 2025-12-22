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

// Helper to emit from controllers
export function emitScheduleUpdate(doctorId: string) {
  if (io) {
    io.to(`doctor:${doctorId}:slots`).emit("schedule:updated", { doctorId });
  }
}
