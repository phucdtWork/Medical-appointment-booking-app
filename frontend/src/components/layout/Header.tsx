"use client";

import Link from "next/link";
import { Button, Dropdown, Space } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  GlobalOutlined,
  MenuOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth, useClassName } from "@/hooks";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";

export default function Header() {
  const { isDark, toggleTheme, language, changeLanguage } = useTheme();
  const { user, logout } = useAuth();

  // Load translations
  const t = useTranslations("components.layout.Header");

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    changeLanguage(newLang);
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
    <header
      className={`sticky top-0 z-50 transition-colors ${useClassName(
        "bg-white shadow-sm",
        "bg-gray-900 shadow-md"
      )}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              MediBook
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {t("nav.features")}
            </Link>
            <Link
              href="#doctors"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {t("nav.doctors")}
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {t("nav.howItWorks")}
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {t("nav.contact")}
            </Link>
          </nav>

          {/* Right Side: Theme + Language + Auth */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              type="text"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              className="hidden sm:flex"
              title={t(`theme.${isDark ? "light" : "dark"}`)}
            />

            {/* Language Dropdown */}
            <Dropdown menu={{ items: languageMenu }} placement="bottomRight">
              <Button type="text" className="hidden sm:flex">
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
            {user ? (
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
                <Link href="/login" className="hidden sm:block">
                  <Button size="large">{t("auth.login")}</Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" size="large">
                    {t("auth.register")}
                  </Button>
                </Link>
              </>
            )}

            <Button type="text" icon={<MenuOutlined />} className="lg:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}
