"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { useTheme } from "@/providers/ThemeProvider";

const ScheduleManager = dynamic(
  () => import("@/components/page/doctor/ScheduleManager"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    ),
  }
);

export default function DoctorSchedulePage() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentDoctor = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user || user.role !== "doctor") {
          router.push("/login");
          return;
        }

        setDoctorId(user.id);
      } catch (error) {
        console.error("Error getting doctor info:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    getCurrentDoctor();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!doctorId) {
    return null;
  }

  const bgClass = isDark
    ? "min-h-screen bg-background-dark text-white py-8"
    : "min-h-screen bg-gray-50 py-8";

  return (
    <div className={`${bgClass}`}>
      <div className="mx-auto max-w-7xl">
        <ScheduleManager doctorId={doctorId} />
      </div>
    </div>
  );
}
