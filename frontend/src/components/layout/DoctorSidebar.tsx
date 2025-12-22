import React from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  ScheduleOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

const { Sider } = Layout;

export default function DoctorSidebar() {
  const pathname = usePathname() || "/";
  const t = useTranslations("breadcrumb");
  const { isDark } = useTheme();

  const items = [
    {
      key: "/doctor-dashboard",
      icon: <HomeOutlined />,
      label: (
        <Link href="/doctor-dashboard">
          {t("doctorDashboard") || "Dashboard"}
        </Link>
      ),
    },
    {
      key: "/schedule",
      icon: <ScheduleOutlined />,
      label: <Link href="/schedule">{t("schedule") || "Schedule"}</Link>,
    },
    {
      key: "/patients",
      icon: <UserOutlined />,
      label: <Link href="/patients">{t("patients") || "Patients"}</Link>,
    },
    {
      key: "/doctor/profile",
      icon: <ProfileOutlined />,
      label: <Link href="/doctor/profile">{t("profile") || "Profile"}</Link>,
    },
  ];

  const selectedKey =
    items.find((i) => pathname.startsWith(i.key))?.key || "/doctor-dashboard";

  return (
    <Sider
      width={220}
      className={`${isDark ? "bg-gray-900 text-white" : "bg-transparent"} border-r`}
    >
      <div
        className={`h-16 flex items-center px-4 ${isDark ? "text-white" : ""}`}
      >
        {/* placeholder */}
      </div>
      <Menu
        mode="inline"
        theme={isDark ? "dark" : "light"}
        selectedKeys={[selectedKey]}
        items={items as any}
      />
    </Sider>
  );
}
