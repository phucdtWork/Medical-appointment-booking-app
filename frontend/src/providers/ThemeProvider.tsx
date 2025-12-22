"use client";

import { ConfigProvider, theme, App } from "antd";
import "@ant-design/v5-patch-for-react-19";
import viVN from "antd/locale/vi_VN";
import enUS from "antd/locale/en_US";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
  const isInitialMount = useRef(true);

  // ✅ Effect 1: Load từ localStorage - Dùng callback để gộp updates
  useEffect(() => {
    // Đọc tất cả giá trị trước
    const savedTheme = localStorage.getItem("theme");
    const savedLang = localStorage.getItem("language") as "vi" | "en" | null;

    // Gộp tất cả updates vào React.startTransition hoặc batch updates
    const updates = () => {
      if (savedTheme === "dark") {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }

      if (savedLang) {
        setLanguage(savedLang);
      }
    };

    // Chạy updates
    updates();
  }, []);

  // ✅ Effect 2: Sync với currentLocale
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (currentLocale && currentLocale !== language) {
      setLanguage(currentLocale as "vi" | "en");
      localStorage.setItem("language", currentLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocale]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");

      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newTheme;
    });
  }, []);

  const changeLanguage = useCallback(
    (newLang: "vi" | "en") => {
      setLanguage(newLang);
      localStorage.setItem("language", newLang);

      const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, "") || "/";
      const newPath = `/${newLang}${pathWithoutLocale}`;
      console.log("Changing to path:", newPath);

      window.location.href = newPath;
    },
    [pathname]
  );

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
            Form: {
              itemMarginBottom: 14,
            },
          },
        }}
      >
        <App>{children}</App>
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
