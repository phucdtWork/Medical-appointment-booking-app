import { useClassName } from "@/hooks";
import { Row, Col } from "antd";
import { useTranslations } from "next-intl";

export default function HowItWorksSection() {
  const t = useTranslations("home");

  return (
    <section
      id="how-it-works"
      className={`py-20 ${useClassName("bg-white", "bg-gray-700")}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-4 ${useClassName(
              "text-text-primary",
              "text-text-primary-dark"
            )}`}
          >
            {t("howItWorks.title")}
          </h2>
          <p
            className={`text-xl ${useClassName(
              "text-text-secondary",
              "text-text-secondary-dark"
            )}`}
          >
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={8}>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">1</span>
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${useClassName(
                  "text-text-primary",
                  "text-text-primary-dark"
                )}`}
              >
                {t("howItWorks.step1.title")}
              </h3>
              <p
                className={`${useClassName(
                  "text-text-secondary",
                  "text-text-secondary-dark"
                )}`}
              >
                {t("howItWorks.step1.description")}
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${useClassName(
                  "text-text-primary",
                  "text-text-primary-dark"
                )}`}
              >
                {t("howItWorks.step2.title")}
              </h3>
              <p
                className={`${useClassName(
                  "text-text-secondary",
                  "text-text-secondary-dark"
                )}`}
              >
                {t("howItWorks.step2.description")}
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${useClassName(
                  "text-text-primary",
                  "text-text-primary-dark"
                )}`}
              >
                {t("howItWorks.step3.title")}
              </h3>
              <p
                className={`${useClassName(
                  "text-text-secondary",
                  "text-text-secondary-dark"
                )}`}
              >
                {t("howItWorks.step3.description")}
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
