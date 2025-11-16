"use client";

import { Layout } from "antd";

import { Footer, Header } from "@/components/layout";

const { Content } = Layout;

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
