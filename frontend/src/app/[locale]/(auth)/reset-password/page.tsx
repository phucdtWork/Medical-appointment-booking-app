"use client";

import { Form, Input, Button, Card } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useForgotPasswordReset } from "@/hooks/mutations/useForgotPasswordMutation";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { Logo } from "@/components/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { email: string; otp: string };
}) {
  const t = useTranslations("auth");
  const resetMutation = useForgotPasswordReset();
  const { isDark } = useTheme();
  const router = useRouter();
  const [form] = Form.useForm();

  const bgClass = isDark
    ? "bg-gradient-to-br from-foreground to-background-dark"
    : "bg-gradient-to-br from-blue-50 to-indigo-100";
  const textPrimary = isDark ? "text-primary-dark" : "text-text-primary";
  const textSecondary = isDark ? "text-secondary-dark" : "text-text-secondary";
  const cardClass = isDark ? "bg-gray-800 border-background-dark" : "";

  const onFinish = (values: { password: string; confirm: string }) => {
    resetMutation.mutate(
      {
        email: searchParams.email,
        otp: searchParams.otp,
        newPassword: values.password,
      },
      {
        onSuccess: () => {
          router.push("/login");
        },
      },
    );
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
            {t("resetPasswordTitle")}
          </h1>
          <p className={`${textSecondary} mt-2`}>{t("resetPasswordDesc")}</p>
        </div>
        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="on"
        >
          <Form.Item
            label={<span className={textPrimary}>{t("newPassword")}</span>}
            name="password"
            rules={[
              { required: true, message: t("passwordRequired") },
              { min: 6, message: t("passwordMinLength") },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("newPasswordPlaceholder")}
            />
          </Form.Item>
          <Form.Item
            label={<span className={textPrimary}>{t("confirmPassword")}</span>}
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: t("confirmPasswordRequired") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("passwordsDoNotMatch")));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("confirmPasswordPlaceholder")}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={resetMutation.isLoading}
              block
            >
              {t("resetPassword")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
