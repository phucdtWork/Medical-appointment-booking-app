"use client";

import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  NotificationOutlined,
  LockOutlined,
} from "@ant-design/icons";

export default function ProfileSidebar() {
  const items = [
    { label: "Overview", key: "overview", icon: <UserOutlined /> },
    { label: "Personal Information", key: "personal", icon: <UserOutlined /> },
    {
      label: "Contact Information",
      key: "contact",
      icon: <NotificationOutlined />,
    },
    {
      label: "Medical / Professional",
      key: "medprof",
      icon: <SolutionOutlined />,
    },
    { label: "Security", key: "security", icon: <LockOutlined /> },
  ];

  return (
    <aside className="w-64 sticky top-20">
      <div className="bg-white dark:bg-foreground rounded-2xl p-4 shadow-sm border">
        <Menu items={items} mode="inline" />
      </div>
    </aside>
  );
}
