import React, { memo } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

const { Sider } = Layout;

function PatientSidebarComponent() {
  const pathname = usePathname() || "/";
  const t = useTranslations("breadcrumb");
  const { isDark } = useTheme();

  const items = [
    {
      key: "/dashboard",
      icon: <HomeOutlined />,
      label: (
        <Link href="/dashboard">{t("patientDashboard") || "Dashboard"}</Link>
      ),
    },
    {
      key: "/doctors",
      icon: <UsergroupAddOutlined />,
      label: <Link href="/doctors">{t("doctors") || "Doctors"}</Link>,
    },
    {
      key: "/appointments",
      icon: <CalendarOutlined />,
      label: (
        <Link href="/appointments">{t("appointments") || "Appointments"}</Link>
      ),
    },
    {
      key: "/patient/profile",
      icon: <ProfileOutlined />,
      label: <Link href="/patient/profile">{t("profile") || "Profile"}</Link>,
    },
  ];

  const selectedKey =
    items.find((i) => pathname.startsWith(i.key))?.key || "/dashboard";

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
        items={items}
      />
    </Sider>
  );
}

// ✅ Memoize component để tránh re-render không cần thiết
const PatientSidebar = memo(PatientSidebarComponent);
export default PatientSidebar;
