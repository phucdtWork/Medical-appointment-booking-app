"use client";

import { Button, Row, Col, Avatar, Statistic } from "antd";
import { RightOutlined, StarFilled } from "@ant-design/icons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const t = useTranslations("home");
  const { isDark } = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const bgGradient = isDark
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const textBlue = isDark ? "text-blue-400" : "text-blue-500";
  const bgBlueBlur = isDark ? "bg-blue-800" : "bg-blue-200";
  const bgPurpleBlur = isDark ? "bg-purple-800" : "bg-purple-200";

  return (
    <section className={`relative ${bgGradient} py-20 overflow-hidden`}>
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 ${bgBlueBlur} rounded-full opacity-20 blur-3xl`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 ${bgPurpleBlur} rounded-full opacity-20 blur-3xl`}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Row gutter={[48, 48]} align="middle">
          {/* Left Content */}
          <Col xs={24} lg={12}>
            <div className="text-center lg:text-left">
              <h1
                className={`text-5xl md:text-6xl font-bold ${textPrimary} mb-6 leading-tight`}
              >
                {t("hero.title")}
                <span className={`block ${textBlue}`}>
                  {t("hero.titleHighlight")}
                </span>
              </h1>
              <p
                className={`text-xl mx-auto lg:mx-0 ${textSecondary} mb-8 max-w-2xl`}
              >
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!isAuthenticated && (
                  <Button
                    type="primary"
                    size="large"
                    className="h-14 px-8 text-lg font-medium"
                    onClick={() => router.push("/register")}
                  >
                    {t("hero.startNow")} <RightOutlined />
                  </Button>
                )}
                <Button
                  size="large"
                  className="h-14 px-8 text-lg"
                  color="primary"
                  variant="outlined"
                  onClick={() => router.push("/doctors")}
                >
                  {t("hero.findDoctor")}
                </Button>
              </div>

              <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                <div>
                  <Statistic
                    value={30}
                    suffix="+"
                    valueStyle={{
                      color: isDark ? "#60a5fa" : "#1890ff",
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                    }}
                  />
                  <div className={textSecondary}>{t("hero.stats.doctors")}</div>
                </div>
                <div>
                  <Statistic
                    value={10000}
                    suffix="+"
                    valueStyle={{
                      color: isDark ? "#60a5fa" : "#1890ff",
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                    }}
                  />
                  <div className={textSecondary}>
                    {t("hero.stats.patients")}
                  </div>
                </div>
                <div>
                  <Statistic
                    value={4.9}
                    precision={1}
                    suffix={<StarFilled style={{ color: "#fbbf24" }} />}
                    valueStyle={{
                      color: isDark ? "#60a5fa" : "#1890ff",
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                    }}
                  />
                  <div className={textSecondary}>{t("hero.stats.rating")}</div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Image with Organic Blob Background */}
          <Col xs={24} lg={12}>
            <div className="relative flex items-center justify-center h-[600px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 600 600"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="blobGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: "#1890ff",
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: "#096dd9",
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#blobGradient)"
                    d="M455.4,302.5Q449,355,408.5,386.2Q368,417.5,328,442.5Q288,467.5,245,446Q202,424.5,148,409.5Q94,394.5,62.5,347Q31,299.5,49,249.5Q67,199.5,87,156Q107,112.5,154.5,110.5Q202,108.5,245,87Q288,65.5,332,86Q376,106.5,409,135.5Q442,164.5,453.5,207.2Q465,250,455.4,302.5Z"
                  />
                </svg>
              </div>

              {/* Doctor Image */}
              <div className="relative top-[-20%] z-10 flex items-end justify-center h-full">
                <Image
                  src="/images/doctor_main.png"
                  alt="Bác sĩ chuyên nghiệp"
                  width={400}
                  height={550}
                  className="h-[550px] w-auto object-cover object-top"
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                  }}
                />
              </div>

              {/* 24/7 Service Badge - Top Right */}
              <div
                className={`absolute top-10 right-10 ${
                  isDark ? "bg-foreground" : "bg-white"
                } rounded-2xl px-6 py-3 shadow-lg z-20 animate-float`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-bold  text-blue-500
                    `}
                  >
                    24/7
                  </span>
                  <span className={`text-blue-500 font-medium`}>
                    {t("hero.service")}
                  </span>
                </div>
              </div>

              {/* Our Professionals Badge - Bottom Left */}
              <div
                className={`absolute bottom-20 left-0 ${
                  isDark ? "bg-gray-800" : "bg-white"
                } rounded-2xl px-5 py-3 shadow-lg z-20 animate-float-delayed`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Avatar.Group
                      max={{
                        count: 4,
                        style: {
                          color: "#fff",
                          backgroundColor: isDark ? "#0d9488" : "#1890ff",
                          fontSize: "14px",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <Avatar src="https://i.pravatar.cc/150?img=1" size={40} />
                      <Avatar src="https://i.pravatar.cc/150?img=5" size={40} />
                      <Avatar src="https://i.pravatar.cc/150?img=9" size={40} />
                      <Avatar
                        style={{
                          backgroundColor: "#1890ff",
                        }}
                        size={40}
                      >
                        {t("hero.more")}
                      </Avatar>
                    </Avatar.Group>
                  </div>
                  <div>
                    <div
                      className={`text-sm font-semibold ${
                        isDark ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {t("hero.professionals")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
