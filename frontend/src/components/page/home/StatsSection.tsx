"use client";

import { Row, Col, Statistic } from "antd";
import { useTranslations } from "next-intl";
import { StarFilled } from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeProvider";

export default function StatsSection() {
  const t = useTranslations("home");
  const { isDark } = useTheme();

  // Tính toán background class dựa trên dark mode
  const bgClass = isDark
    ? "bg-gradient-to-br from-purple-900 to-blue-900"
    : "bg-gradient-to-br from-blue-600 to-purple-600";

  return (
    <section className={`py-20 ${bgClass} text-white`}>
      <div className="max-w-7xl mx-auto px-4">
        <Row gutter={[32, 32]}>
          <Col xs={12} md={6}>
            <Statistic
              title={
                <span className="text-white text-opacity-90">
                  {t("stats.doctors")}
                </span>
              }
              value={500}
              suffix="+"
              valueStyle={{
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
              }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title={
                <span className="text-white text-opacity-90">
                  {t("stats.patients")}
                </span>
              }
              value={10000}
              suffix="+"
              valueStyle={{
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
              }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title={
                <span className="text-white text-opacity-90">
                  {t("stats.appointments")}
                </span>
              }
              value={50000}
              suffix="+"
              valueStyle={{
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
              }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Statistic
              title={
                <span className="text-white text-opacity-90">
                  {t("stats.rating")}
                </span>
              }
              value={4.9}
              suffix={
                <>
                  /5 <StarFilled style={{ color: "gold" }} />
                </>
              }
              valueStyle={{
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
              }}
            />
          </Col>
        </Row>
      </div>
    </section>
  );
}
