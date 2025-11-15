import { useTheme } from "@/providers/ThemeProvider";

export function useClassName(lightClass: string, darkClass: string) {
  const { isDark } = useTheme();
  return isDark ? darkClass : lightClass;
}
