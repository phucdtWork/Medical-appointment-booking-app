import {
  DoctorSchedule,
  TimeRange,
  WeeklySchedule,
} from "../models/DoctorSchedule";
import { AvailableTimeSlot } from "../models/TimeSlot";
import { Appointment } from "../models/Appointment";
import {
  addMinutes,
  format,
  parse,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";

export class SlotGeneratorService {
  /**
   * Generate available slots for a doctor on a specific date
   */
  static async generateSlotsForDate(
    doctorId: string,
    date: string, // "2025-12-15"
    schedule: DoctorSchedule,
    existingAppointments: Appointment[]
  ): Promise<AvailableTimeSlot[]> {
    const slots: AvailableTimeSlot[] = [];

    if (schedule.blockedDates.includes(date)) {
      return []; // No slots available
    }

    const timeRanges = this.getTimeRangesForDate(date, schedule);

    if (timeRanges.length === 0) {
      return []; // Doctor not working this day
    }

    for (const range of timeRanges) {
      const rangeSlots = this.generateSlotsFromRange(
        doctorId,
        date,
        range,
        schedule.slotDuration
      );
      slots.push(...rangeSlots);
    }

    // 4. Remove slots that overlap with break times
    const slotsAfterBreaks = this.filterBreakTimes(slots, schedule.breakTimes);

    // 5. Mark booked slots
    const finalSlots = this.markBookedSlots(
      slotsAfterBreaks,
      existingAppointments
    );

    // 6. Filter out past slots
    const now = new Date();
    return finalSlots.filter((slot) => {
      const slotDateTime = parse(
        `${slot.date} ${slot.start}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      return isAfter(slotDateTime, now);
    });
  }

  /**
   * Get time ranges for a specific date (considering custom schedules)
   */
  private static getTimeRangesForDate(
    date: string,
    schedule: DoctorSchedule
  ): TimeRange[] {
    // Check if there's a custom schedule for this date
    const customSchedule = schedule.customSchedules.find(
      (cs) => cs.date === date
    );

    if (customSchedule) {
      if (!customSchedule.isWorking) {
        return []; // Doctor not working
      }
      return customSchedule.timeRanges;
    }

    // Otherwise use weekly schedule
    const dayOfWeek = this.getDayOfWeek(date);
    return schedule.workingHours[dayOfWeek] || [];
  }

  /**
   * Generate slots from a time range
   */
  private static generateSlotsFromRange(
    doctorId: string,
    date: string,
    range: TimeRange,
    slotDuration: number
  ): AvailableTimeSlot[] {
    const slots: AvailableTimeSlot[] = [];

    const startTime = parse(range.start, "HH:mm", new Date());
    const endTime = parse(range.end, "HH:mm", new Date());

    let currentTime = startTime;

    while (isBefore(currentTime, endTime)) {
      const slotEnd = addMinutes(currentTime, slotDuration);

      // Only add if slot end is within range
      if (
        isBefore(slotEnd, endTime) ||
        slotEnd.getTime() === endTime.getTime()
      ) {
        slots.push({
          doctorId,
          date,
          start: format(currentTime, "HH:mm"),
          end: format(slotEnd, "HH:mm"),
          isAvailable: true,
          isBooked: false,
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  }

  /**
   * Filter out slots that overlap with break times
   */
  private static filterBreakTimes(
    slots: AvailableTimeSlot[],
    breakTimes: TimeRange[]
  ): AvailableTimeSlot[] {
    if (breakTimes.length === 0) return slots;

    return slots.filter((slot) => {
      const slotStart = parse(slot.start, "HH:mm", new Date());
      const slotEnd = parse(slot.end, "HH:mm", new Date());

      // Check if slot overlaps with any break time
      for (const breakTime of breakTimes) {
        const breakStart = parse(breakTime.start, "HH:mm", new Date());
        const breakEnd = parse(breakTime.end, "HH:mm", new Date());

        // Check overlap
        if (
          isWithinInterval(slotStart, { start: breakStart, end: breakEnd }) ||
          isWithinInterval(slotEnd, { start: breakStart, end: breakEnd }) ||
          (isBefore(slotStart, breakStart) && isAfter(slotEnd, breakEnd))
        ) {
          return false; // Overlaps with break
        }
      }

      return true; // No overlap
    });
  }

  /**
   * Mark booked slots based on existing appointments
   */
  private static markBookedSlots(
    slots: AvailableTimeSlot[],
    appointments: Appointment[]
  ): AvailableTimeSlot[] {
    return slots.map((slot) => {
      const isBooked = appointments.some(
        (apt) =>
          apt.status !== "cancelled" &&
          apt.status !== "rejected" &&
          apt.timeSlot.start === slot.start &&
          apt.timeSlot.end === slot.end
      );

      const bookedAppointment = appointments.find(
        (apt) =>
          apt.status !== "cancelled" &&
          apt.status !== "rejected" &&
          apt.timeSlot.start === slot.start
      );

      return {
        ...slot,
        isBooked,
        isAvailable: !isBooked,
        appointmentId: bookedAppointment?.id,
      };
    });
  }

  /**
   * Get day of week from date string
   */
  private static getDayOfWeek(date: string): keyof WeeklySchedule {
    const days: (keyof WeeklySchedule)[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dateObj = parse(date, "yyyy-MM-dd", new Date());
    return days[dateObj.getDay()];
  }
}
