import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MediBook - Đặt lịch khám bệnh",
  description: "Hệ thống đặt lịch khám bệnh trực tuyến",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider>
          <QueryProvider>
            <AntdRegistry>
              <ThemeProvider>{children}</ThemeProvider>
            </AntdRegistry>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
