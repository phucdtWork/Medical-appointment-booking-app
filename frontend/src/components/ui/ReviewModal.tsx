"use client";

import React, { useState } from "react";
import { Modal, Rate, Input, Button, message } from "antd";
import api from "@/lib/api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { doctorKeys } from "@/hooks/queries/useDoctorsQuery";
import { useTranslations } from "next-intl";

const { TextArea } = Input;

interface ReviewModalProps {
  open: boolean;
  doctorId: string;
  appointmentId?: string;
  onClose: () => void;
}

export default function ReviewModal({
  open,
  doctorId,
  appointmentId,
  onClose,
}: ReviewModalProps) {
  const t = useTranslations("patientDashboard");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const qc = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!doctorId) return;
    setSubmitting(true);
    try {
      await api.post("/reviews", {
        doctorId,
        appointmentId,
        rating,
        comment,
      });
      if (doctorId)
        qc.invalidateQueries({ queryKey: doctorKeys.detail(doctorId) });
      message.success(t("notifications.reviewSubmitted"));
      onClose();
      setComment("");
      setRating(5);
    } catch (err: { message?: string } | unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : t("notifications.error");
      message.error(errorMessage || t("notifications.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={t("appointmentDrawer.leaveReviewButton")}
      onCancel={onClose}
      footer={
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>{t("actions.cancel")}</Button>
          <Button type="primary" onClick={handleSubmit} loading={submitting}>
            {t("actions.accept")}
          </Button>
        </div>
      }
    >
      <div>
        <div style={{ marginBottom: 12 }}>
          <Rate value={rating} onChange={(v) => setRating(v)} />
        </div>
        <TextArea
          rows={4}
          placeholder="Share your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </Modal>
  );
}
