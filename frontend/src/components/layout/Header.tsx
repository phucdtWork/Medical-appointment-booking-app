"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Dropdown, Segmented, Space, Drawer, message } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  GlobalOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/hooks";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { Logo } from "../ui";
import { useNotification } from "@/providers/NotificationProvider";

export default function Header() {
  const { isDark, toggleTheme, language, changeLanguage } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const t = useTranslations("components.layout.Header");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bgClass = isDark ? "bg-gray-900 shadow-md" : "bg-white shadow-sm";

  const notification = useNotification();

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    changeLanguage(newLang);
  };

  // Handle theme change from Segmented
  const handleThemeChange = (value: string | number) => {
    const shouldBeDark = value === "dark";
    if (isDark !== shouldBeDark) {
      toggleTheme();
    }
  };

  // Language dropdown menu
  const languageMenu: MenuProps["items"] = [
    {
      key: "vi",
      label: (
        <div className="flex items-center gap-2">
          <span>🇻🇳</span>
          <span>{t("language.vietnamese")}</span>
        </div>
      ),
      onClick: () => language === "en" && toggleLanguage(),
    },
    {
      key: "en",
      label: (
        <div className="flex items-center gap-2">
          <span>🇬🇧</span>
          <span>{t("language.english")}</span>
        </div>
      ),
      onClick: () => language === "vi" && toggleLanguage(),
    },
  ];

  // User menu (when logged in)
  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href="/profile">{t("userMenu.profile")}</Link>,
    },
    {
      key: "appointments",
      label: <Link href="/appointments">{t("userMenu.appointments")}</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: t("userMenu.logout"),
      onClick: logout,
      danger: true,
    },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-colors ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="medium" showText={true} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="#features"
                className={`hover:text-blue-600 transition`}
              >
                <p className={`text-lg`}>{t("nav.features")}</p>
              </Link>
              <Link
                href="#doctors"
                className={`hover:text-blue-600 transition`}
              >
                <p className={`text-lg`}>{t("nav.doctors")}</p>
              </Link>
              <Link
                href="#how-it-works"
                className={`hover:text-blue-600 transition`}
              >
                <p className={`text-lg`}>{t("nav.howItWorks")}</p>
              </Link>
              <Link
                href="#contact"
                className={`hover:text-blue-600 transition`}
              >
                <p className={`text-lg`}>{t("nav.contact")}</p>
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Segmented
                value={isDark ? "dark" : "light"}
                onChange={handleThemeChange}
                size="middle"
                options={[
                  { value: "light", icon: <SunOutlined /> },
                  { value: "dark", icon: <MoonOutlined /> },
                ]}
              />

              {/* Language Dropdown */}
              <Dropdown menu={{ items: languageMenu }} placement="bottomRight">
                <Button type="text">
                  <Space>
                    <GlobalOutlined />
                    <span className="hidden md:inline">
                      {language === "vi" ? "VI" : "EN"}
                    </span>
                    <DownOutlined className="text-xs" />
                  </Space>
                </Button>
              </Dropdown>

              {/* Auth Buttons or User Menu */}
              {isAuthenticated ? (
                <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                  <Button type="primary">
                    <Space>
                      <span>{user.fullName}</span>
                      <DownOutlined className="text-xs" />
                    </Space>
                  </Button>
                </Dropdown>
              ) : (
                <>
                  <Link href="/login">
                    <Button color="primary" variant="outlined">
                      {t("auth.login")}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button type="primary" variant="outlined">
                      {t("auth.register")}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="block lg:hidden">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        title={t("drawer.title") || "Menu"}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={300}
      >
        <div className="flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              className={`hover:text-blue-600 transition`}
              onClick={() => setDrawerOpen(false)}
            >
              <p className={`text-lg`}>{t("nav.features")}</p>
            </Link>
            <Link
              href="#doctors"
              className={`hover:text-blue-600 transition`}
              onClick={() => setDrawerOpen(false)}
            >
              <p className={`text-lg`}>{t("nav.doctors")}</p>
            </Link>
            <Link
              href="#how-it-works"
              className={`hover:text-blue-600 transition`}
              onClick={() => setDrawerOpen(false)}
            >
              <p className={`text-lg`}>{t("nav.howItWorks")}</p>
            </Link>
            <Link
              href="#contact"
              className={`hover:text-blue-600 transition`}
              onClick={() => setDrawerOpen(false)}
            >
              <p className={`text-lg`}>{t("nav.contact")}</p>
            </Link>
          </nav>

          {/* Theme Segmented */}
          <div>
            <label className={`block mb-2 text-sm font-medium `}>
              {t("drawer.theme") || "Theme"}
            </label>
            <Segmented
              value={isDark ? "dark" : "light"}
              onChange={handleThemeChange}
              size="middle"
              block
              options={[
                { value: "light", icon: <SunOutlined />, label: "Light" },
                { value: "dark", icon: <MoonOutlined />, label: "Dark" },
              ]}
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className={`block mb-2 text-sm font-medium `}>
              {t("drawer.language") || "Language"}
            </label>
            <Dropdown menu={{ items: languageMenu }} placement="bottomLeft">
              <Button type="text" block className="text-left">
                <Space>
                  <GlobalOutlined />
                  <span>
                    {language === "vi" ? "🇻🇳 Vietnamese" : "🇬🇧 English"}
                  </span>
                  <DownOutlined className="text-xs" />
                </Space>
              </Button>
            </Dropdown>
          </div>

          {/* Auth Section */}
          {user ? (
            <div>
              <label className={`block mb-2 text-sm font-medium `}>
                {t("drawer.account") || "Account"}
              </label>
              <Dropdown menu={{ items: userMenu }} placement="bottomLeft">
                <Button type="primary" block>
                  <Space>
                    <span>{user.fullName}</span>
                    <DownOutlined className="text-xs" />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setDrawerOpen(false)}>
                <Button size="large" block>
                  {t("auth.login")}
                </Button>
              </Link>
              <Link href="/register" onClick={() => setDrawerOpen(false)}>
                <Button type="primary" size="large" block>
                  {t("auth.register")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
