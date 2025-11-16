"use client";

import { Button, Card, ConfigProvider, Pagination, Select, theme } from "antd";
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const [language, setLanguage] = useState<"vi" | "en">("vi"); // Default
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Load language từ localStorage
    const savedLang = localStorage.getItem("language") as "vi" | "en";
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

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

    // Force reload để middleware sync locale
    window.location.href = newPath; // Hoặc router.push(newPath); router.refresh();
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
              // ===== SIZE CONTROLS =====
              controlHeight: 40,
              controlHeightLG: 56,
              controlHeightSM: 28,

              // ===== HORIZONTAL PADDING =====
              paddingContentHorizontal: 24,
              paddingContentHorizontalLG: 36,
              paddingContentHorizontalSM: 16,

              // ===== FONT SIZE =====
              fontSize: 15,
              fontSizeLG: 18,
              fontSizeSM: 13,

              // ===== HOVER EFFECTS =====
              // Primary button hover shadow với blue glow
              primaryShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
            },
            Selection: {},
          },
        }}
      >
        {children}
      </ConfigProvider>
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
