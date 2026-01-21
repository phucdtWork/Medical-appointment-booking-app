"use client";

import { Form, Input, Button, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRequestOtp } from "@/hooks";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { Logo } from "@/components/ui";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const requestOtp = useRequestOtp();
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");

  const bgClass = isDark
    ? "bg-gradient-to-br from-foreground to-background-dark"
    : "bg-gradient-to-br from-blue-50 to-indigo-100";
  const textPrimary = isDark ? "text-primary-dark" : "text-text-primary";
  const textSecondary = isDark ? "text-secondary-dark" : "text-text-secondary";
  const cardClass = isDark ? "bg-gray-800 border-background-dark" : "";

  const onFinish = (values: { email: string }) => {
    setEmail(values.email);
    requestOtp.mutate(values.email);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgClass} py-12 px-4`}
    >
      <Card className={`w-full max-w-md shadow-xl ${cardClass}`}>
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Logo size="large" showText={false} className="justify-center mb-4" />
          <h1 className={`text-3xl font-bold ${textPrimary}`}>
            {t("forgotPasswordTitle")}
          </h1>
          <p className={`${textSecondary} mt-2`}>{t("forgotPasswordDesc")}</p>
        </div>
        <Form
          name="forgot-password"
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
              prefix={<MailOutlined />}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={requestOtp.isLoading}
              block
            >
              {t("sendOtp")}
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-between mt-4">
          <Link href="/login" className="text-blue-500 hover:underline">
            {t("backToLogin")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
