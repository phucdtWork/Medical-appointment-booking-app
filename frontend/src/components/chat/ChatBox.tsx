"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Space } from "antd";
import {
  QuestionCircleOutlined,
  FireOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeProvider";
import { useNotification } from "@/providers/NotificationProvider";
import { useLocale, useTranslations } from "next-intl";
import { FEATURES_EN, FEATURES_VI } from "@/utils/chatFeatures";
import {
  Feature,
  ChatMessage,
  FeaturesResult,
  WeightLossData,
  WeightLossPlan,
  ChatBoxProps,
} from "@/types/chat";
import WeightLossForm from "./WeightLossForm";
import WeightLossPlanDisplay from "./WeightLossPlanDisplay";
import Image from "next/image";

export default function ChatBoxDemo({ onClose }: ChatBoxProps) {
  const notification = useNotification();
  const t = useTranslations("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const locale = useLocale() as "en" | "vi";
  const [isWelcome, setIsWelcome] = useState(true);
  const [featuresResult, setFeaturesResult] = useState<FeaturesResult | null>(
    null,
  );
  const [showFeaturesResult, setShowFeaturesResult] = useState(false);
  const [showWeightLossForm, setShowWeightLossForm] = useState(false);
  const [weightLossLoading, setWeightLossLoading] = useState(false);
  const [weightLossPlan, setWeightLossPlan] = useState<WeightLossPlan | null>(
    null,
  );
  const [weightLossData, setWeightLossData] = useState<WeightLossData | null>(
    null,
  );
  const [formResetKey, setFormResetKey] = useState(0);
  const { isDark } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleShowAllFeatures = () => {
    try {
      setShowFeaturesResult(true);
      setIsWelcome(false);

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: t("features"),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const features = locale === "en" ? FEATURES_EN : FEATURES_VI;
      // Show all features
      setFeaturesResult({
        answer:
          locale === "en"
            ? "Here are all available features:"
            : "Dưới đây là tất cả các tính năng có sẵn:",
        isRelevant: true,
        features: features,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load features";
      console.error("Features error:", errorMessage);
      notification.error({ message: errorMessage });
    }
  };

  const handleWeightLossClick = () => {
    setShowWeightLossForm(true);
    setShowFeaturesResult(false);
    setIsWelcome(false);
    setFormResetKey((prev) => prev + 1); // Force form reset via key change
  };

  const handleWeightLossSubmit = async (values: WeightLossData) => {
    try {
      setWeightLossLoading(true);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        notification.error({
          message: data.error || "Failed to generate weight loss plan",
        });
        return;
      }

      setWeightLossData(values); // Store for PDF export
      setWeightLossPlan(data.plan);
      setShowWeightLossForm(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate plan";
      console.error("Weight loss error:", errorMessage);
      notification.error({ message: errorMessage });
    } finally {
      setWeightLossLoading(false);
    }
  };

  const backToChatDefault = () => {
    setWeightLossPlan(null);
    setWeightLossData(null);
    setShowWeightLossForm(false);
    setFeaturesResult(null);
    setShowFeaturesResult(false);
    setIsWelcome(true);
    setMessages([]);
  };

  const bgClass = isDark
    ? "bg-gray-900 border-gray-700"
    : "bg-white border-gray-200";

  return (
    <div
      className={`w-full h-full flex flex-col rounded-lg shadow-2xl overflow-hidden border ${bgClass}`}
    >
      {/* Header */}
      <div className="p-4 bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <Image
              src="/images/chatBoxImg.png"
              alt="MediBook AI"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-sm">{t("headerTitle")}</h3>
            <p className="text-xs opacity-90">{t("headerStatus")}</p>
          </div>
        </div>
        <Space>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined style={{ color: "white", fontSize: 16 }} />}
            className="text-white hover:text-gray-200"
            onClick={onClose}
          />
        </Space>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${bgClass}`}>
        {showWeightLossForm ? (
          <WeightLossForm
            key={formResetKey}
            onSubmit={handleWeightLossSubmit}
            loading={weightLossLoading}
            isDark={isDark}
            onCancel={backToChatDefault}
          />
        ) : weightLossPlan ? (
          <div className="flex flex-col gap-4">
            <WeightLossPlanDisplay
              plan={weightLossPlan}
              userData={weightLossData || undefined}
              locale={locale}
            />
            <Space className="w-full px-2">
              <Button
                onClick={() => {
                  setWeightLossPlan(null);
                  setShowWeightLossForm(true);
                  setFormResetKey((prev) => prev + 1);
                }}
                type="primary"
                icon={<PlusOutlined style={{ fontSize: 16 }} />}
                className="h-9"
              >
                {t("reset")}
              </Button>
              <Button
                onClick={backToChatDefault}
                icon={<CloseOutlined style={{ fontSize: 16 }} />}
                className="h-9"
              >
                {t("reload")}
              </Button>
            </Space>
          </div>
        ) : isWelcome && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg">
              <Image
                src="/images/chatBoxImg.png"
                alt="MediBook AI"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <h4
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("welcome")}
            </h4>
            <p
              className={`text-sm text-center px-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {t("subtitle")}
            </p>

            <Space direction="vertical" className="w-full px-2 mt-4">
              <Button
                block
                icon={<QuestionCircleOutlined style={{ fontSize: 16 }} />}
                onClick={() => handleShowAllFeatures()}
                className="text-left h-10"
              >
                {t("features")}
              </Button>
              <Button
                block
                type="primary"
                icon={<FireOutlined style={{ fontSize: 16 }} />}
                onClick={() => handleWeightLossClick()}
                className="text-left h-10"
              >
                {t("weightLoss")}
              </Button>
            </Space>
          </div>
        ) : (
          <>
            {/* Features Display - Always show if available */}
            {showFeaturesResult && featuresResult && (
              <div className="mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-gray-900 whitespace-pre-wrap leading-relaxed mb-4">
                    {featuresResult.answer}
                  </div>
                  {featuresResult.features.length > 0 && (
                    <div className="space-y-2">
                      {featuresResult.features.map((feature) => (
                        <div
                          key={feature.id}
                          onClick={() => {
                            if (feature.id === "weight_loss_plan") {
                              handleWeightLossClick();
                            }
                          }}
                          className={`p-3 bg-blue-50 rounded-lg border border-blue-100 ${
                            feature.id === "weight_loss_plan"
                              ? "cursor-pointer hover:bg-blue-100 hover:shadow-md transition"
                              : ""
                          }`}
                        >
                          <div className="font-semibold text-blue-900 flex items-center gap-2">
                            <FireOutlined style={{ color: "#ff7a45" }} />
                            {feature.name}
                            {feature.id === "weight_loss_plan" && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded ml-auto">
                                {locale === "en"
                                  ? "Click to start"
                                  : "Bấm để bắt đầu"}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {feature.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Back to Chat Button */}
                  <Button
                    block
                    onClick={backToChatDefault}
                    icon={<CloseOutlined style={{ fontSize: 16 }} />}
                    className="mt-4 h-9"
                  >
                    {t("reload")}
                  </Button>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {[...messages]
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}
                >
                  <div
                    className={`max-w-lg px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
