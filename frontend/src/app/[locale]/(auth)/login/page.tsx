"use client";

import { Form, Input, Button, Card, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLogin } from "@/hooks";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth"); // Hook để lấy translations từ section "auth"
  const loginMutation = useLogin();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onFinish = (values: any) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            M
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {t("loginTitle")}
          </h1>
          <p className="text-gray-600 mt-2">{t("welcomeBack")}</p>
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
            label={t("email")}
            name="email"
            rules={[
              { required: true, message: t("emailRequired") },
              { type: "email", message: t("emailInvalid") },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="your.email@example.com"
            />
          </Form.Item>

          <Form.Item
            label={t("password")}
            name="password"
            rules={[
              { required: true, message: t("passwordRequired") },
              { min: 6, message: t("passwordMin") },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="••••••••"
            />
          </Form.Item>

          <div className="flex items-center justify-between mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">{t("rememberMe")}</span>
              </label>
            </Form.Item>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
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
          <span className="text-gray-400 text-sm">{t("or")}</span>
        </Divider>

        {/* Google Login */}
        <Button icon={<GoogleOutlined />} size="large" block className="mb-6">
          {t("loginWithGoogle")}
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-600">{t("noAccount")} </span>
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            {t("registerNow")}
          </Link>
        </div>

        {/* Doctor Login Link */}
        <div className="text-center mt-4">
          <Link
            href="/doctor-login"
            className="text-sm text-cyan-600 hover:underline"
          >
            {t("doctorLogin")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
