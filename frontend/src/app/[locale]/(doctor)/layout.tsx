"use client";

import { Layout } from "antd";
import { Footer, Header } from "@/components/layout";
import ProtectedRoute from "@/utils/ProtectedRoute";

const { Content } = Layout;

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header />
        <ProtectedRoute requireRole="doctor">
          <Content>{children}</Content>
        </ProtectedRoute>
      </Layout>
      <Footer />
    </Layout>
  );
}
