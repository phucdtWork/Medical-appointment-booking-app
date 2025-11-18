"use client";

import { Form, Input, Button, Card } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRequestOtp } from "@/hooks";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const requestOtp = useRequestOtp();
  const router = useRouter();
  const { isDark } = useTheme();

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
  const linkClass = isDark
    ? "text-blue-300 font-medium hover:underline"
    : "text-blue-600 font-medium hover:underline";

  const onFinish = (values: any) => {
    const { fullName, email, phone, password } = values;

    sessionStorage.setItem(
      "registerData",
      JSON.stringify({ fullName, email, phone, password })
    );

    requestOtp.mutate(values?.email, {
      onSuccess: () => {
        router.push("/verify-otp");
      },
    });
  };

  return (
    <div className={wrapperClass}>
      {/* Logo centered above the card */}

      <Card className={cardClass}>
        <div className="w-full max-w-md mx-auto flex justify-center mb-4">
          <Logo showText={false} size="large" />
        </div>
        <div className="text-center mb-8">
          <h1 className={titleClass}>{t("title")}</h1>
          <p className={descClass}>{t("description")}</p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <Form.Item
            label={t("labels.fullName")}
            name="fullName"
            rules={[{ required: true, message: t("errors.fullName") }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder={t("placeholders.fullName")}
            />
          </Form.Item>

          <Form.Item
            label={t("labels.email")}
            name="email"
            rules={[
              { required: true, message: t("errors.emailRequired") },
              { type: "email", message: t("errors.emailInvalid") },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder={t("placeholders.email")}
            />
          </Form.Item>

          <Form.Item
            label={t("labels.phone")}
            name="phone"
            rules={[
              { required: true, message: t("errors.phoneRequired") },
              {
                pattern: /^[0-9]{10}$/,
                message: t("errors.phoneInvalid"),
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder={t("placeholders.phone")}
            />
          </Form.Item>

          <Form.Item
            label={t("labels.password")}
            name="password"
            rules={[
              { required: true, message: t("errors.passwordRequired") },
              { min: 6, message: t("errors.passwordMin") },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={t("placeholders.password")}
            />
          </Form.Item>

          <Form.Item
            label={t("labels.confirmPassword")}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: t("errors.confirmPassword") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("errors.passwordMismatch"))
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={t("placeholders.confirmPassword")}
            />
          </Form.Item>

          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t("errors.mustAgree"))),
              },
            ]}
          >
            <label
              className={`flex items-start ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              <input type="checkbox" className="mr-2 mt-1" />
              <span className="text-sm">
                {t("agree.prefix")}{" "}
                <Link href="/terms" className={`${linkClass}`}>
                  {t("agree.terms")}
                </Link>{" "}
                {t("agree.and")}{" "}
                <Link href="/privacy" className={`${linkClass}`}>
                  {t("agree.privacy")}
                </Link>
              </span>
            </label>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={requestOtp.isPending}
              block
              className="h-12 text-base font-medium"
            >
              {t("actions.sendOtp")}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
            {t("alreadyAccount.prefix")}{" "}
          </span>
          <Link href="/login" className={linkClass}>
            {t("alreadyAccount.loginLink")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
