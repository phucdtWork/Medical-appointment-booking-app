"use client";

import { Form, Input, Button, Card, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLogin } from "@/hooks";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const loginMutation = useLogin();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
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
          <h1 className="text-3xl font-bold text-gray-800">Đăng nhập</h1>
          <p className="text-gray-600 mt-2">Chào mừng trở lại MediBook</p>
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
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="your.email@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
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
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
            </Form.Item>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
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
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Divider */}
        <Divider plain>
          <span className="text-gray-400 text-sm">hoặc</span>
        </Divider>

        {/* Google Login */}
        <Button icon={<GoogleOutlined />} size="large" block className="mb-6">
          Đăng nhập với Google
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>

        {/* Doctor Login Link */}
        <div className="text-center mt-4">
          <Link
            href="/doctor-login"
            className="text-sm text-cyan-600 hover:underline"
          >
            Bạn là bác sĩ? Đăng nhập tại đây →
          </Link>
        </div>
      </Card>
    </div>
  );
}
