"use client";

import { Card, Row, Col } from "antd";
import {
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CreditCardOutlined,
  MobileOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useClassName } from "@/hooks";

export default function FeaturesSection() {
  const t = useTranslations("home");

  // Card style cho dark mode
  const cardClassName = useClassName(
    "text-center h-full hover:shadow-xl transition-shadow",
    "text-center h-full hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 bg-gray-800 border-gray-600"
  );

  // Text color cho description
  const descriptionClassName = useClassName(
    "text-gray-600",
    "text-text-secondary-dark"
  );

  // Title color cho card
  const cardTitleClassName = useClassName(
    "text-2xl font-bold mb-4",
    "text-2xl font-bold mb-4 text-text-primary-dark"
  );

  const cardTitleSmallClassName = useClassName(
    "text-xl font-bold mb-3",
    "text-xl font-bold mb-3 text-text-primary-dark"
  );

  return (
    <section
      id="features"
      className={`py-20 ${useClassName("bg-white", "bg-gray-700")}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-4 ${useClassName(
              "text-primary",
              "text-text-primary-dark"
            )}`}
          >
            {t("features.title")}
          </h2>
          <p
            className={`text-xl ${useClassName(
              "text-secondary",
              "text-text-secondary-dark"
            )} max-w-2xl mx-auto`}
          >
            {t("features.subtitle")}
          </p>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <Card className={cardClassName}>
              <div className="w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TeamOutlined className="text-4xl" style={{ color: "white" }} />
              </div>
              <h3 className={cardTitleClassName}>
                {t("features.feature1.title")}
              </h3>
              <p className={descriptionClassName}>
                {t("features.feature1.description")}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card className={cardClassName}>
              <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ClockCircleOutlined
                  className="text-4xl"
                  style={{ color: "white" }}
                />
              </div>
              <h3 className={cardTitleClassName}>
                {t("features.feature2.title")}
              </h3>
              <p className={descriptionClassName}>
                {t("features.feature2.description")}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card className={cardClassName}>
              <div className="w-16 h-16 bg-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <SafetyCertificateOutlined
                  className="text-4xl"
                  style={{ color: "white" }}
                />
              </div>
              <h3 className={cardTitleClassName}>
                {t("features.feature3.title")}
              </h3>
              <p className={descriptionClassName}>
                {t("features.feature3.description")}
              </p>
            </Card>
          </Col>
        </Row>

        <Row gutter={[32, 32]} className="mt-8">
          <Col xs={24} md={8}>
            <Card className={cardClassName}>
              <div className="w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCardOutlined
                  className="text-4xl"
                  style={{ color: "white" }}
                />
              </div>
              <h3 className={cardTitleSmallClassName}>
                {t("features.feature4.title")}
              </h3>
              <p className={descriptionClassName}>
                {t("features.feature4.description")}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card className={cardClassName}>
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MobileOutlined
                  className="text-4xl"
                  style={{ color: "white" }}
                />
              </div>
              <h3 className={cardTitleSmallClassName}>
                {t("features.feature5.title")}
              </h3>
              <p className={descriptionClassName}>
                {t("features.feature5.description")}
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card className={cardClassName}>
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <StarOutlined className="text-4xl" style={{ color: "white" }} />
              </div>
              <h3 className={cardTitleSmallClassName}>
                {t("features.feature6.title")}
              </h3>
              <p className={descriptionClassName}>
                {t("features.feature6.description")}
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
}
