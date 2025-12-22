import React from "react";
import { Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/queries/useAuthQuery";
import { useTranslations } from "next-intl";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const t = useTranslations("components.layout.Header");

  const items = [
    {
      key: "profile",
      label: <Link href="/profile">{t("userMenu.profile")}</Link>,
    },
    {
      key: "appointments",
      label: <Link href="/appointments">{t("userMenu.appointments")}</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      label: t("userMenu.logout"),
      onClick: logout,
      danger: true,
    },
  ];

  if (!user) return null;

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button type="text">
        <Space>
          <span>{user.fullName}</span>
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
