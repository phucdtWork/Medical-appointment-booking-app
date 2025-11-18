import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import "../globals.css";
import { notFound } from "next/navigation";
import { BreadcrumbProvider } from "@/providers/BreadcrumbProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!["en", "vi"].includes(locale)) {
    notFound();
  }

  const t = await getTranslations("metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!["en", "vi"].includes(locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AntdRegistry>
              <BreadcrumbProvider>
                <ThemeProvider>
                  <NotificationProvider>{children}</NotificationProvider>
                </ThemeProvider>
              </BreadcrumbProvider>
            </AntdRegistry>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
