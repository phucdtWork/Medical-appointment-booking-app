"use client";

import { Button } from "antd";
import { useTranslations } from "next-intl";
import { useAuth, useClassName } from "@/hooks";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const t = useTranslations("home");
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <section
      className={`py-20 ${useClassName(
        "bg-gradient-to-br from-blue-50 to-indigo-50",
        "bg-gradient-to-br from-foreground to-background-dark",
      )}`}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2
          className={`text-4xl md:text-5xl font-bold ${useClassName(
            "text-gray-900",
            "text-white",
          )} mb-6`}
        >
          {t("cta.title")}
        </h2>
        <p
          className={`text-xl ${useClassName(
            "text-gray-600",
            "text-gray-300",
          )} mb-8`}
        >
          {t("cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated && (
            <Button
              type="primary"
              size="large"
              className="h-14 px-10 text-lg font-medium"
              onClick={() => router.push("/register")}
            >
              {t("cta.registerFree")}
            </Button>
          )}

          <Button
            size="large"
            variant="outlined"
            color="primary"
            className="h-14 px-10 text-lg"
            onClick={() => router.push("/doctors")}
          >
            {t("cta.findDoctorNow")}
          </Button>
        </div>
      </div>
    </section>
  );
}
