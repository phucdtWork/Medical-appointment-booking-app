"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { Row, Col, Button } from "antd";
import { MessageOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const t = useTranslations("about");
  const { isDark } = useTheme();
  const router = useRouter();

  // Dark mode classes
  const bgClass = isDark ? "bg-gray-900" : "bg-white";
  const textPrimary = isDark ? "text-primary-dark" : "text-slate-900";
  const textSecondary = isDark ? "text-secondary-dark" : "text-slate-600";

  const bgGradient = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const textBlue = isDark ? "text-blue-400" : "text-blue-500";
  const bgBlueBlur = isDark ? "bg-blue-800" : "bg-blue-200";
  const bgPurpleBlur = isDark ? "bg-purple-800" : "bg-purple-200";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Header />

      {/* Creator Section with Hero-like styling */}
      <section
        className={`relative ${bgGradient} py-20 md:py-32 overflow-hidden`}
      >
        {/* Background blur effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-40 -right-40 w-80 h-80 ${bgBlueBlur} rounded-full opacity-20 blur-3xl`}
          ></div>
          <div
            className={`absolute -bottom-40 -left-40 w-80 h-80 ${bgPurpleBlur} rounded-full opacity-20 blur-3xl`}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <Row gutter={[48, 48]} align="middle">
            {/* Creator Info */}
            <Col xs={24} md={12}>
              <div className="text-center md:text-left">
                <h1
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold ${textPrimary} leading-tight mb-6`}
                >
                  {t("creator.greeting")} <br /> {t("creator.name")}
                </h1>

                <p
                  className={`text-lg md:text-xl leading-relaxed ${textSecondary} mb-8`}
                >
                  {t("creator.introduction")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    type="primary"
                    size="large"
                    className="h-12 px-8 text-base font-medium flex items-center justify-center"
                    onClick={() => router.push("/contact")}
                  >
                    {t("creator.contact_text")} <RightOutlined />
                  </Button>
                  <Button
                    size="large"
                    className="h-12 px-8 text-base flex items-center justify-center"
                    color="primary"
                    variant="outlined"
                    onClick={() => router.push("/contact")}
                  >
                    <MessageOutlined style={{ fontSize: "18px" }} />
                    Message
                  </Button>
                </div>

                <p
                  className={`text-lg md:text-xl leading-relaxed ${textSecondary} mt-10`}
                >
                  {t("creator.contact_prefix")}{" "}
                  <a
                    href="mailto:phucdt.work@gmail.com"
                    className="transition-all duration-200 text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-500 hover:underline font-bold"
                  >
                    {t("creator.email_label")}
                  </a>{" "}
                  {t("creator.or")}{" "}
                  <a
                    href="https://github.com/phucdtWork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-all duration-200 text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-500 hover:underline font-bold"
                  >
                    GitHub
                  </a>
                </p>
              </div>
            </Col>

            {/* Creator Image */}
            <Col xs={24} md={12} className="flex justify-center">
              <div
                className={`relative ${isDark ? "drop-shadow-2xl" : "drop-shadow-xl"}`}
                style={{
                  maxWidth: "450px",
                  width: "100%",
                }}
              >
                <img
                  className="w-full h-auto rounded-2xl object-cover"
                  src="/images/avatar.png"
                  alt={t("creator.name")}
                  style={{
                    boxShadow: isDark
                      ? "0 20px 40px rgba(0,0,0,0.6)"
                      : "0 20px 40px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <Footer />
    </div>
  );
}
