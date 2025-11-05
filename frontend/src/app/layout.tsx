import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryProvider } from "../lib/react-query/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediBook - Đặt lịch khám bệnh",
  description: "Hệ thống đặt lịch khám bệnh trực tuyến",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QueryProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </QueryProvider>
      </body>
    </html>
  );
}
