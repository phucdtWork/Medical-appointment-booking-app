import { BreadcrumbConfig } from "@/types/breadcrumb.types";

export const breadcrumbConfig: BreadcrumbConfig = {
  doctors: { translationKey: "doctors" },
  dashboard: { translationKey: "dashboard" },
  "doctor-dashboard": { translationKey: "doctorDashboard" },
  appointments: { translationKey: "appointments" },
  profile: { translationKey: "profile" },
  settings: { translationKey: "settings" },
};

export const excludedRoutes = [
  "login",
  "register",
  "forgot-password",
  "reset-password",
];
