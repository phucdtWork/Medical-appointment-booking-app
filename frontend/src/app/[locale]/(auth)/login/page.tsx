"use client";

import { Form, Input, Button, Card, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLogin } from "@/hooks";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { Logo } from "@/components/ui";

export default function LoginPage() {
  const t = useTranslations("auth");
  const loginMutation = useLogin();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onFinish = (values: any) => {
    loginMutation.mutate(values);
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
          autoComplete="off"
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
          variant="outline"
          color={"primary"}
          size="large"
          block
          className="mb-6 bg-red-500"
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
