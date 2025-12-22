export interface WeeklySchedule {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
}

export interface TimeRange {
  start: string; // "09:00"
  end: string; // "17:00"
}

export interface DoctorSchedule {
  id?: string;
  doctorId: string;

  // Weekly working hours
  workingHours: WeeklySchedule;

  // Slot configuration
  slotDuration: 30 | 60; // minutes

  // Break times (apply to all days)
  breakTimes: TimeRange[];

  // Blocked dates (holidays, vacations)
  blockedDates: string[]; // ["2025-12-25", "2025-12-31"]

  // Custom schedules for specific dates (override weekly)
  customSchedules: {
    date: string; // "2025-12-20"
    timeRanges: TimeRange[];
    isWorking: boolean; // false = day off
  }[];

  timezone: string;

  allowDoubleBooking: boolean;
  maxAppointmentsPerDay?: number;

  createdAt: Date;
  updatedAt: Date;
}

export const DOCTOR_SCHEDULES_COLLECTION = "doctor_schedules";
