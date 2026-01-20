import api from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface TimeRange {
  start: string;
  end: string;
}

export interface WeeklySchedule {
  monday: TimeRange[];
  tuesday: TimeRange[];
  wednesday: TimeRange[];
  thursday: TimeRange[];
  friday: TimeRange[];
  saturday: TimeRange[];
  sunday: TimeRange[];
}

export interface DoctorSchedule {
  id?: string;
  doctorId: string;
  workingHours: WeeklySchedule;
  slotDuration: 30 | 60;
  breakTimes: TimeRange[];
  blockedDates: string[];
  customSchedules: {
    date: string;
    timeRanges: TimeRange[];
    isWorking: boolean;
  }[];
  timezone: string;
  allowDoubleBooking: boolean;
}

export interface TimeSlot {
  doctorId: string;
  date: string;
  start: string;
  end: string;
  isAvailable: boolean;
  isBooked: boolean;
  isBeingBooked?: boolean;
  appointmentId?: string;
}

export const scheduleService = {
  upsertSchedule: async (
    scheduleData: Partial<DoctorSchedule>,
  ): Promise<DoctorSchedule> => {
    const response = await api.post(`/schedules`, scheduleData);
    return response.data;
  },

  getSchedule: async (doctorId: string): Promise<DoctorSchedule> => {
    const response = await api.get(`/schedules/doctor/${doctorId}`);
    return response.data;
  },

  getAvailableSlots: async (
    doctorId: string,
    date: string,
  ): Promise<TimeSlot[]> => {
    const response = await api.get(`/schedules/doctor/${doctorId}/slots`, {
      params: { date },
    });
    return response.data.slots;
  },

  getAvailableSlotsRange: async (
    doctorId: string,
    startDate: string,
    days: number = 7,
  ): Promise<{ [date: string]: TimeSlot[] }> => {
    const response = await api.get(
      `/schedules/doctor/${doctorId}/slots/range`,
      { params: { startDate, days } },
    );
    return response.data;
  },
};

// React Query hooks
export const useSchedule = (doctorId?: string | null) => {
  return useQuery({
    queryKey: ["schedule", doctorId],
    queryFn: () => scheduleService.getSchedule(doctorId as string),
    enabled: !!doctorId,
  });
};

export const useUpsertSchedule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DoctorSchedule>) =>
      scheduleService.upsertSchedule(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schedule"] }),
  });
};

export default scheduleService;
