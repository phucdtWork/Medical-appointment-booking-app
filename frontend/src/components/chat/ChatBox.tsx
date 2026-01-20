"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Space, App, message } from "antd";
import {
  QuestionCircleOutlined,
  FireOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeProvider";
import { useLocale, useTranslations } from "next-intl";
import WeightLossForm from "./WeightLossForm";
import WeightLossPlanDisplay from "./WeightLossPlanDisplay";
import Image from "next/image";

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface FeaturesResult {
  answer: string;
  isRelevant: boolean;
  features: Feature[];
}

interface WeightLossData {
  name: string;
  age: number;
  weight: number;
  height: number;
  goalWeight: number;
  exerciseTime: number;
}

interface WeightLossPlan {
  summary: string;
  bmi: number;
  bmiCategory: string;
  exerciseCalendar: {
    day: string;
    activity: string;
    duration: number;
    calories: number;
  }[];
  nutrition: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  timeline: { weeksToGoal: number; weeklyWeightLoss: number };
}

// Feature lists for both languages
const FEATURES_EN: Feature[] = [
  {
    id: "doctor_search",
    name: "Doctor Search",
    description: "Search for doctors by name, specialty, location, and ratings",
    category: "Appointment Management",
  },
  {
    id: "appointment_booking",
    name: "Appointment Booking",
    description: "Book appointments with doctors at available time slots",
    category: "Appointment Management",
  },
  {
    id: "appointment_reschedule",
    name: "Appointment Rescheduling",
    description:
      "Reschedule your existing appointments to a different date/time",
    category: "Appointment Management",
  },
  {
    id: "appointment_cancellation",
    name: "Appointment Cancellation",
    description: "Cancel your appointments if needed",
    category: "Appointment Management",
  },
  {
    id: "doctor_ratings",
    name: "Doctor Ratings & Reviews",
    description: "View and submit reviews and ratings for doctors",
    category: "Doctor Information",
  },
  {
    id: "doctor_profile",
    name: "Doctor Profile",
    description:
      "View detailed doctor profiles with specialization, experience, and fees",
    category: "Doctor Information",
  },
  {
    id: "medical_history",
    name: "Medical History Management",
    description:
      "Maintain and manage your medical records and health information",
    category: "Health Records",
  },
  {
    id: "health_ai_chat",
    name: "Health AI Assistant",
    description:
      "Chat with AI for health advice, information, and personalized recommendations",
    category: "Health Services",
  },
  {
    id: "weight_loss_plan",
    name: "Weight Loss Plan Generator",
    description:
      "Generate personalized weight loss plans based on your health metrics",
    category: "Health Services",
  },
  {
    id: "appointment_history",
    name: "Appointment History",
    description: "View your past and upcoming appointments",
    category: "Appointment Management",
  },
  {
    id: "notifications",
    name: "Appointment Notifications",
    description: "Receive notifications and reminders for your appointments",
    category: "Notifications",
  },
  {
    id: "multiple_languages",
    name: "Multi-Language Support",
    description: "Use the application in English or Vietnamese",
    category: "Accessibility",
  },
  {
    id: "dark_mode",
    name: "Dark Mode",
    description: "Switch between light and dark theme for comfortable viewing",
    category: "Accessibility",
  },
];

const FEATURES_VI: Feature[] = [
  {
    id: "doctor_search",
    name: "Tìm Kiếm Bác Sĩ",
    description: "Tìm kiếm bác sĩ theo tên, chuyên khoa, địa điểm và đánh giá",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "appointment_booking",
    name: "Đặt Lịch Hẹn",
    description: "Đặt lịch khám với bác sĩ tại các khung giờ khả dụng",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "appointment_reschedule",
    name: "Dời Lịch Hẹn",
    description: "Dời lịch khám của bạn sang ngày/giờ khác",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "appointment_cancellation",
    name: "Hủy Lịch Hẹn",
    description: "Hủy các lịch khám của bạn nếu cần",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "doctor_ratings",
    name: "Đánh Giá & Nhận Xét Bác Sĩ",
    description: "Xem và gửi đánh giá, nhận xét cho bác sĩ",
    category: "Thông Tin Bác Sĩ",
  },
  {
    id: "doctor_profile",
    name: "Hồ Sơ Bác Sĩ",
    description:
      "Xem hồ sơ chi tiết bác sĩ với chuyên khoa, kinh nghiệm và phí khám",
    category: "Thông Tin Bác Sĩ",
  },
  {
    id: "medical_history",
    name: "Quản Lý Lịch Sử Y Tế",
    description: "Lưu trữ và quản lý hồ sơ y tế cá nhân của bạn",
    category: "Hồ Sơ Sức Khỏe",
  },
  {
    id: "health_ai_chat",
    name: "Trợ Lý AI Sức Khỏe",
    description:
      "Trò chuyện với AI để nhận lời khuyên sức khỏe, thông tin và đề xuất cá nhân hóa",
    category: "Dịch Vụ Sức Khỏe",
  },
  {
    id: "weight_loss_plan",
    name: "Tạo Lộ Trình Giảm Cân",
    description:
      "Tạo lộ trình giảm cân được cá nhân hóa dựa trên chỉ số sức khỏe của bạn",
    category: "Dịch Vụ Sức Khỏe",
  },
  {
    id: "appointment_history",
    name: "Lịch Sử Lịch Hẹn",
    description: "Xem các lịch hẹn quá khứ và sắp tới",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "notifications",
    name: "Thông Báo Lịch Hẹn",
    description: "Nhận thông báo và nhắc nhở về lịch khám của bạn",
    category: "Thông Báo",
  },
  {
    id: "multiple_languages",
    name: "Hỗ Trợ Đa Ngôn Ngữ",
    description: "Sử dụng ứng dụng bằng tiếng Anh hoặc tiếng Việt",
    category: "Khả Năng Truy Cập",
  },
  {
    id: "dark_mode",
    name: "Chế Độ Tối",
    description: "Chuyển đổi giữa giao diện sáng và tối để xem thoải mái",
    category: "Khả Năng Truy Cập",
  },
];

interface ChatBoxProps {
  onClose?: () => void;
}

export default function ChatBoxDemo({ onClose }: ChatBoxProps) {
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
      messageApi?.error(errorMessage);
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
        message.error(data.error || "Failed to generate weight loss plan");
        return;
      }

      setWeightLossData(values); // Store for PDF export
      setWeightLossPlan(data.plan);
      setShowWeightLossForm(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate plan";
      console.error("Weight loss error:", errorMessage);
      message.error(errorMessage);
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
