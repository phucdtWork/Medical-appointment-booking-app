"use client";

import { Form, Input, Button, Card, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
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
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

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

  const onFinish = (values: any) => {
    loginMutation.mutate(values);
  };

  const handleGoogle = async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      googleMutation.mutate(idToken);
    } catch (err: any) {
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
          icon={<GoogleOutlined />}
          onClick={handleGoogle}
          loading={googleMutation.isLoading}
          block
          className="mb-6 bg-red-500 flex items-center justify-center"
        >
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
