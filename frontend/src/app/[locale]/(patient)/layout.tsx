"use client";

import { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider, Content } = Layout;

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">Trang chủ</Link>,
    },
    {
      key: "/doctors",
      icon: <MedicineBoxOutlined />,
      label: <Link href="/doctors">Tìm bác sĩ</Link>,
    },
    {
      key: "/appointments",
      icon: <CalendarOutlined />,
      label: <Link href="/appointments">Lịch hẹn</Link>,
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: <Link href="/profile">Hồ sơ</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="p-4 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto">
            M
          </div>
          {!collapsed && (
            <p className="text-white mt-2 font-medium">MediBook</p>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}
