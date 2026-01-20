"use client";

import { Form, Input, Button, Card, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLogin } from "@/hooks";
import { useGoogleLogin } from "@/lib/services/authService";
import getFirebaseAuth from "@/lib/firebaseClient";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { Logo } from "@/components/ui";

export default function LoginPage() {
  const t = useTranslations("auth");
  const loginMutation = useLogin();
  const googleMutation = useGoogleLogin();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === "doctor") {
        router.push("/doctor/appointments");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  // If a redirect sign-in was used, handle the result here
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const auth = getFirebaseAuth();
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const idToken = await result.user.getIdToken();
          googleMutation.mutate(idToken);
        }
      } catch (err) {
        console.error("getRedirectResult error:", err);
      }
    };

    handleRedirectResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = (values: { email: string; password: string }) => {
    loginMutation.mutate(values);
  };

  const handleGoogle = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      googleMutation.mutate(idToken);
    } catch (err) {
      console.warn("signInWithPopup failed, falling back to redirect:", err);
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        console.error("signInWithRedirect failed:", redirectErr);
      }
    }
  };

  // Dark mode classes
  const bgClass = isDark
    ? "bg-gradient-to-br from-foreground to-background-dark"
    : "bg-gradient-to-br from-blue-50 to-indigo-100";
  const textPrimary = isDark ? "text-primary-dark" : "text-text-primary";
  const textSecondary = isDark ? "text-secondary-dark" : "text-text-secondary";
  const cardClass = isDark ? "bg-gray-800 border-background-dark" : "";

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgClass} py-12 px-4`}
    >
      <Card className={`w-full max-w-md shadow-xl ${cardClass}`}>
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Logo size="large" showText={false} className="justify-center mb-4" />
          <h1 className={`text-3xl font-bold ${textPrimary}`}>
            {t("loginTitle")}
          </h1>
          <p className={`${textSecondary} mt-2`}>{t("welcomeBack")}</p>
        </div>

        {/* Login Form */}
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="on"
        >
          <Form.Item
            label={<span className={textPrimary}>{t("email")}</span>}
            name="email"
            rules={[
              { required: true, message: t("emailRequired") },
              { type: "email", message: t("emailInvalid") },
            ]}
          >
            <Input
              prefix={<UserOutlined className={textSecondary} />}
              placeholder="your.email@example.com"
              autoComplete="email"
              className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </Form.Item>

          <Form.Item
            label={<span className={textPrimary}>{t("password")}</span>}
            name="password"
            rules={[
              { required: true, message: t("passwordRequired") },
              { min: 6, message: t("passwordMin") },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className={textSecondary} />}
              placeholder="••••••••"
              autoComplete="current-password"
              className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </Form.Item>

          <div className="flex items-center justify-between mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className={`text-sm ${textSecondary}`}>
                  {t("rememberMe")}
                </span>
              </label>
            </Form.Item>
            <Link
              href="/forgot-password"
              className={`text-sm text-blue-600 hover:underline ${
                isDark ? "text-blue-400" : ""
              }`}
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              block
              className="h-12 text-base font-medium"
            >
              {t("loginButton")}
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider plain>
          <span
            className={`text-gray-400 text-sm ${isDark ? "text-gray-500" : ""}`}
          >
            {t("or")}
          </span>
        </Divider>

        {/* Google Login */}
        <Button
          onClick={handleGoogle}
          loading={googleMutation?.isPending}
          block
          size="large"
          className="mb-6 h-12 text-base font-medium flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t("loginWithGoogle")}
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <span className={textSecondary}>{t("noAccount")} </span>
          <Link
            href="/register"
            className={`text-blue-600 font-medium hover:underline ${
              isDark ? "text-blue-400" : ""
            }`}
          >
            {t("registerNow")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
