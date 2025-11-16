"use client";

import { Button } from "antd";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth, useClassName } from "@/hooks";

export default function CTASection() {
  const t = useTranslations("home");

  const { isAuthenticated } = useAuth();

  return (
    <section
      className={`py-20 ${useClassName(
        "bg-gradient-to-br from-blue-50 to-indigo-50",
        "bg-gradient-to-br from-foreground to-background-dark"
      )}`}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2
          className={`text-4xl md:text-5xl font-bold ${useClassName(
            "text-gray-900",
            "text-white"
          )} mb-6`}
        >
          {t("cta.title")}
        </h2>
        <p
          className={`text-xl ${useClassName(
            "text-gray-600",
            "text-gray-300"
          )} mb-8`}
        >
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated && (
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                className="h-14 px-10 text-lg font-medium"
              >
                {t("cta.registerFree")}
              </Button>
            </Link>
          )}

          <Link href="/doctors">
            <Button
              size="large"
              variant="outlined"
              color="primary"
              className="h-14 px-10 text-lg"
            >
              {t("cta.findDoctorNow")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
