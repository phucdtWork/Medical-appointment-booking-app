export interface AvailableTimeSlot {
  doctorId: string;
  date: string; // "2025-12-15"
  start: string; // "09:00"
  end: string; // "09:30"
  isAvailable: boolean;
  isBooked: boolean;
  isBeingBooked?: boolean; // Someone is currently booking
  appointmentId?: string; // If booked
}

export interface SlotBookingStatus {
  slotKey: string; // "doctorId_2025-12-15_09:00"
  userId: string;
  expiresAt: Date; // Booking lock expires after 5 minutes
}

// Temporary booking locks (in-memory or Redis)
export const BOOKING_LOCKS = new Map<string, SlotBookingStatus>();
