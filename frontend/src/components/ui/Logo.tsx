import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";

const sizeConfig = {
  small: {
    icon: "w-10 h-10 text-base",
    text: "text-lg",
  },
  medium: {
    icon: "w-12 h-12 text-xl",
    text: "text-2xl",
  },
  large: {
    icon: "w-16 h-16 text-3xl",
    text: "text-4xl",
  },
};

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  href?: string;
  className?: string;
  variant?: "auto" | "light" | "dark";
}

export default function Logo({
  size = "medium",
  showText = true,
  href = "/",
  className = "",
  variant = "auto",
}: LogoProps) {
  const config = sizeConfig[size];
  const { isDark } = useTheme();

  // Logic chọn màu dựa trên variant
  const textPrimaryClass =
    variant === "light"
      ? "text-white"
      : variant === "dark"
      ? "text-gray-800"
      : isDark
      ? "text-white"
      : "text-gray-800"; // auto

  const logoElement = (
    <div className={`flex items-center gap-2 ${textPrimaryClass} ${className}`}>
      <div
        className={`${config.icon} bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold`}
      >
        M
      </div>
      {showText && (
        <span className={`${config.text} font-bold text-current`}>
          MediBook
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{logoElement}</Link>;
  }

  return logoElement;
}
