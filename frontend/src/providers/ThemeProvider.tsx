"use client";

import { ConfigProvider, theme, App } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  locale: typeof viVN | typeof enUS;
  language: "vi" | "en";
  changeLanguage: (lang: "vi" | "en") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const pathname = usePathname();
  const currentLocale = useLocale();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const savedLang = localStorage.getItem("language") as "vi" | "en";
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    if (currentLocale && currentLocale !== language) {
      setLanguage(currentLocale as "vi" | "en");
      localStorage.setItem("language", currentLocale);
    }
  }, [currentLocale, language]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const changeLanguage = (newLang: "vi" | "en") => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);

    const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, "") || "/";
    const newPath = `/${newLang}${pathWithoutLocale}`;
    console.log("Changing to path:", newPath);

    window.location.href = newPath;
  };

  const localeAntd = language === "vi" ? viVN : enUS;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        locale: localeAntd,
        language,
        changeLanguage,
      }}
    >
      {/* ✅ Wrap bằng AntdRegistry thay vì StyleProvider */}
      <AntdRegistry>
        <ConfigProvider
          locale={localeAntd}
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#1890ff",
              borderRadius: 8,
              colorBgContainer: isDark ? "#001529" : "#ffffff",
              colorText: isDark ? "#ffffff" : "#000000",
              colorBorder: isDark ? "#424242" : "#d9d9d9",
              colorBgElevated: isDark ? "var(--background-dark)" : "#ffffff",
            },
            components: {
              Drawer: {
                colorBgElevated: isDark ? "#001529" : "#ffffff",
                colorIcon: isDark ? "#ffffff" : "#000000",
              },
              Dropdown: {
                colorBgElevated: isDark ? "var(--background-dark)" : "#ffffff",
              },
              Segmented: {
                colorBgElevated: isDark ? "var(--background-dark)" : "#ffffff",
                trackBg: isDark ? "var(--foreground)" : "#f5f5f5",
              },
              Button: {
                controlHeight: 40,
                controlHeightLG: 56,
                controlHeightSM: 28,
                paddingContentHorizontal: 24,
                paddingContentHorizontalLG: 36,
                paddingContentHorizontalSM: 16,
                fontSize: 15,
                fontSizeLG: 18,
                fontSizeSM: 13,
                primaryShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
              },
            },
          }}
        >
          {/* ✅ App component phải ở trong ConfigProvider */}
          <App>{children}</App>
        </ConfigProvider>
      </AntdRegistry>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
