"use client";

import { useParams } from "next/navigation";
import { Row, Col, Spin, Card } from "antd";
import { useDoctor } from "@/hooks";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import DoctorHeader from "@/components/page/doctor-detail/DoctorHeader";
import DoctorTabs from "@/components/page/doctor-detail/DoctorTabs";
import BookingForm from "@/components/page/doctor-detail/BookingForm";
import { useTheme } from "@/providers/ThemeProvider";

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;
  const { isDark } = useTheme();
  const t = useTranslations("doctorDetail");

  const { data, isLoading, error } = useDoctor(doctorId);
  const [isMobile, setIsMobile] = useState(false);

  const doctor = data?.data;

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDark ? "bg-background-dark" : "bg-gray-50"
        }`}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div
        className={`flex justify-center items-center min-h-screen ${
          isDark ? "bg-background-dark" : "bg-gray-50"
        }`}
      >
        <Card className={isDark ? "bg-slate-800 border-slate-700" : ""}>
          <p
            className={isDark ? "text-text-primary-dark" : "text-text-primary"}
          >
            {t("notFound")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 transition-colors ${
        isDark
          ? "bg-linear-to-br from-background-dark to-slate-900"
          : "bg-linear-to-br from-blue-50 to-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Doctor Header with Stats */}
        <DoctorHeader doctor={doctor} />

        <Row gutter={[24, 24]}>
          {/* Left Column - Info Tabs */}
          <Col xs={24} lg={14}>
            <DoctorTabs doctor={doctor} />
          </Col>

          {/* Right Column - Booking Form (Desktop only) */}
          {!isMobile && (
            <Col xs={24} lg={10}>
              <BookingForm doctorId={doctorId} doctor={doctor} />
            </Col>
          )}
        </Row>

        {/* Mobile Booking Bottom Bar */}
        {isMobile && (
          <BookingForm doctorId={doctorId} doctor={doctor} isMobile={true} />
        )}

        {/* Add padding bottom on mobile to prevent content being hidden by bottom bar */}
        {isMobile && <div className="h-24" />}
      </div>
    </div>
  );
}
