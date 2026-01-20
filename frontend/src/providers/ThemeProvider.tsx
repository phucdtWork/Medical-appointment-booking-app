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
  useCallback,
  useMemo,
} from "react";
import { usePathname, useRouter } from "next/navigation";
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
  // Start with light theme on server, hydrate with actual theme from localStorage
  const [isDark, setIsDark] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale() as "vi" | "en";

  // Hydrate theme from localStorage on client-side only
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setIsDark(savedTheme);

    // Apply theme class immediately
    if (savedTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setIsHydrated(true);
  }, []);

  // Apply theme classes to DOM when isDark changes
  useEffect(() => {
    if (!isHydrated) return; // Don't apply until after hydration

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark, isHydrated]);

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
      // Get current path and remove locale prefix
      const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, "") || "/";
      const newPath = `/${newLang}${pathWithoutLocale}`;
      console.log("Changing language to:", newLang, "New path:", newPath);

      // Set locale cookie for server-side detection
      document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;

      // Push to new locale - this will trigger server layout to re-run
      router.push(newPath);

      // Force page refresh to ensure layout re-renders with new locale
      setTimeout(() => {
        window.location.href = newPath;
      }, 100);
    },
    [pathname, router],
  );

  const localeAntd = currentLocale === "vi" ? viVN : enUS;

  // ✅ Memoize theme config để tránh re-render component con
  const themeConfig = useMemo(
    () => ({
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
    }),
    [isDark],
  );

  // ✅ Memoize context value to prevent unnecessary re-renders of children
  const contextValue = useMemo(
    () => ({
      isDark: isHydrated ? isDark : false, // Use false until hydrated to match server render
      toggleTheme,
      locale: localeAntd,
      language: currentLocale,
      changeLanguage,
    }),
    [
      isDark,
      toggleTheme,
      localeAntd,
      currentLocale,
      changeLanguage,
      isHydrated,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider locale={localeAntd} theme={themeConfig}>
        <App suppressHydrationWarning>{children}</App>
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
