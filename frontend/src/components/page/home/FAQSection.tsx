"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useClassName } from "@/hooks";
import { DownOutlined } from "@ant-design/icons";

export default function FAQSection() {
  const t = useTranslations("home.faq");
  const [expanded, setExpanded] = useState<number | null>(0);
  const isDarkMode = useClassName("false", "true") === "true";

  const faqs = [
    {
      id: 0,
      question: t("items.0.question"),
      answer: t("items.0.answer"),
    },
    {
      id: 1,
      question: t("items.1.question"),
      answer: t("items.1.answer"),
    },
    {
      id: 2,
      question: t("items.2.question"),
      answer: t("items.2.answer"),
    },
    {
      id: 3,
      question: t("items.3.question"),
      answer: t("items.3.answer"),
    },
    {
      id: 4,
      question: t("items.4.question"),
      answer: t("items.4.answer"),
    },
    {
      id: 5,
      question: t("items.5.question"),
      answer: t("items.5.answer"),
    },
  ];

  const toggleAccordion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <section className={`py-20 ${useClassName("bg-gray-50", "bg-gray-800")}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2
            className={`text-4xl font-bold mb-4 ${useClassName(
              "text-text-primary",
              "text-text-primary-dark",
            )}`}
          >
            {t("title")}
          </h2>
          <p
            className={`text-lg ${useClassName(
              "text-text-secondary",
              "text-text-secondary-dark",
            )}`}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* FAQ Items */}
        <div
          className={`divide-y ${useClassName(
            "divide-gray-300 bg-white rounded-lg shadow-md",
            "divide-gray-700 bg-gray-900 rounded-lg shadow-lg",
          )}`}
        >
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`border-b last:border-b-0 ${useClassName(
                "border-gray-300",
                "border-gray-700",
              )}`}
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className={`w-full text-left font-medium py-6 px-6 flex items-center justify-between transition-colors ${useClassName(
                  "hover:bg-gray-100 text-text-primary",
                  "hover:bg-gray-700 text-text-primary-dark",
                )}`}
              >
                <span className="text-base">{faq.question}</span>
                <DownOutlined
                  style={{
                    fontSize: "16px",
                    transition: "transform 0.3s ease",
                    transform:
                      expanded === faq.id ? "rotate(180deg)" : "rotate(0deg)",
                    color: isDarkMode ? "#e5e7eb" : "#1f2937",
                    flexShrink: 0,
                    marginLeft: "16px",
                  }}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded === faq.id ? "max-h-96" : "max-h-0"
                }`}
              >
                <div
                  className={`px-6 pb-6 text-base leading-relaxed ${useClassName(
                    "text-text-secondary",
                    "text-text-secondary-dark",
                  )}`}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p
            className={`text-base mb-4 ${useClassName(
              "text-text-secondary",
              "text-text-secondary-dark",
            )}`}
          >
            {t("ctaText")}
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("ctaButton")}
          </a>
        </div>
      </div>
    </section>
  );
}
