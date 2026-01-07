import api from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorKeys } from "../../hooks/queries/useDoctorsQuery";

export interface CreateReviewData {
  doctorId: string;
  appointmentId?: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  createReview: async (data: CreateReviewData) => {
    const res = await api.post("/reviews", data);
    return res.data;
  },

  getReviewsByDoctor: async (doctorId: string) => {
    const res = await api.get(`/reviews/doctor/${doctorId}`);
    return res.data;
  },
};

export const useCreateReview = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: CreateReviewData) => reviewService.createReview(data),
    {
      onSuccess: (res, vars) => {
        // invalidate single doctor detail so rating/count refreshes
        qc.invalidateQueries({ queryKey: doctorKeys.detail(vars.doctorId) });
      },
    }
  );
};
