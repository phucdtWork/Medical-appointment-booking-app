import React, { memo, useMemo } from "react";
import { Dropdown, Button, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/queries/useAuthQuery";
import { useTranslations } from "next-intl";

function UserDropdownComponent() {
  const { user, logout } = useAuth();
  const t = useTranslations("components.layout.Header");

  // ✅ Memoize dropdown items
  const items = useMemo(
    () => [
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
    ],
    [t, logout],
  );

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

// ✅ Memoize component để tránh re-render không cần thiết
const UserDropdown = memo(UserDropdownComponent);
export default UserDropdown;
