"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Button, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { useVerifyAndRegister, useResendOtp } from "@/hooks";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const verifyAndRegister = useVerifyAndRegister();
  const resendOtp = useResendOtp();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [registerData, setRegisterData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    password: string;
  } | null>(null);

  const t = useTranslations("auth.verifyOtp");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load register data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("registerData");
    if (!data) {
      router.push("/register");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegisterData(JSON.parse(data));
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // const handlePaste = (e: React.ClipboardEvent) => {
  //   e.preventDefault();
  //   const pastedData = e.clipboardData.getData("text").trim();

  //   // Only process if pasted data is 6 digits
  //   if (/^\d{6}$/.test(pastedData)) {
  //     const newOtp = pastedData.split("");
  //     setOtp(newOtp);
  //     inputRefs.current[5]?.focus();
  //   }
  // };

  const handleInputPaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only process if pasted data is digits
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6 - index);
      const newOtp = [...otp];

      digits.forEach((digit, i) => {
        newOtp[index + i] = digit;
      });

      setOtp(newOtp);

      // Focus on the last filled input or the next empty one
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return;
    }

    if (!registerData) {
      router.push("/register");
      return;
    }

    verifyAndRegister.mutate(
      {
        email: registerData.email,
        otp: otpCode,
        password: registerData.password,
        fullName: registerData.fullName,
        phone: registerData.phone,
      },
      {
        onSuccess: () => {
          sessionStorage.removeItem("registerData");
        },
      },
    );
  };

  const handleResend = () => {
    if (!canResend || !registerData) return;

    resendOtp.mutate(registerData.email, {
      onSuccess: () => {
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      },
    });
  };

  const handleGoBack = () => {
    router.push("/register");
  };

  const wrapperClass = isDark
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-slate-800 py-12 px-4 text-white"
    : "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4";

  const cardClass = isDark
    ? "w-full max-w-md shadow-xl bg-gray-800 text-white"
    : "w-full max-w-md shadow-xl";

  const titleClass = isDark
    ? "text-3xl font-bold text-white"
    : "text-3xl font-bold text-gray-800";

  const descClass = isDark ? "text-gray-300 mt-2" : "text-gray-600 mt-2";

  const inputClass = isDark
    ? "w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 border-gray-600 text-white"
    : "w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className={wrapperClass}>
      <Card className={cardClass}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo showText={false} size="large" />
          </div>
          <h1 className={titleClass}>{t("title")}</h1>
          <p className={descClass}>
            {t("description")}
            {registerData && (
              <span className="block font-semibold mt-1">
                {registerData.email}
              </span>
            )}
          </p>
        </div>

        <Form layout="vertical">
          <Form.Item label={t("labels.enterOtp")} className="mb-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handleInputPaste(index, e)}
                  className={inputClass}
                />
              ))}
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={verifyAndRegister.isPending}
              disabled={otp.join("").length !== 6}
              block
              className="h-12 text-base font-medium"
            >
              {t("actions.confirm")}
            </Button>
          </Form.Item>

          <div className="text-center mt-6">
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              {t("messages.notReceived")}{" "}
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resendOtp.isPending}
                  className={`font-medium ${
                    isDark
                      ? "text-blue-300 hover:text-blue-400"
                      : "text-blue-600 hover:text-blue-700"
                  } ${
                    resendOtp.isPending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {resendOtp.isPending
                    ? t("actions.sending")
                    : t("actions.resend")}
                </button>
              ) : (
                <span
                  className={`font-medium ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {t("messages.resendAfter", { countdown })}
                </span>
              )}
            </p>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleGoBack}
              className={`inline-flex items-center gap-2 font-medium ${
                isDark
                  ? "text-blue-300 hover:text-blue-400"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              <ArrowLeftOutlined />
              {t("actions.goBack")}
            </button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
