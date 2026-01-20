"use client";

import React from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Progress,
  Tag,
  Divider,
  Space,
  Button,
} from "antd";
import {
  HeartOutlined,
  FireOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeProvider";
import { downloadPDFAsHTML } from "@/utils/pdfExport";
import NutritionChart from "./NutritionChart";
import ExerciseChart from "./ExerciseChart";
import ProgressChart from "./ProgressChart";

interface ExerciseCalendarItem {
  day: string;
  activity: string;
  duration: number;
  calories: number;
}

interface NutritionInfo {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface TimelineInfo {
  weeksToGoal: number;
  weeklyWeightLoss: number;
}

interface WeightLossPlan {
  summary: string;
  bmi: number;
  bmiCategory: string;
  exerciseCalendar: ExerciseCalendarItem[];
  nutrition: NutritionInfo;
  timeline: TimelineInfo;
}

interface WeightLossPlanDisplayProps {
  plan: WeightLossPlan;
  userData?: {
    name: string;
    age: number;
    weight: number;
    height: number;
    goalWeight: number;
    exerciseTime: number;
  };
  locale?: string;
}

export default function WeightLossPlanDisplay({
  plan,
  userData,
  locale = "vi",
}: WeightLossPlanDisplayProps) {
  const { isDark } = useTheme();

  const handleExportPDF = () => {
    const userName = userData?.name || "User";
    downloadPDFAsHTML(plan, userName, locale);
  };

  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";

  const getBMIColor = (category: string) => {
    switch (category) {
      case "Thiếu cân":
        return "blue";
      case "Bình thường":
        return "green";
      case "Thừa cân":
        return "orange";
      case "Béo phì":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6 px-2 overflow-y-auto max-h-[calc(100vh-300px)]">
      {/* 1. Summary Section */}
      <Card
        className={`${cardBg} border ${borderColor} rounded-lg page-break-after`}
        title={
          <div className="flex items-center gap-2">
            <HeartOutlined className="text-red-500" />
            <span className={textPrimary}>
              {locale === "en" ? "Health Summary" : "Tóm Tắt Sức Khỏe"}
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          <div
            className={`p-4 ${isDark ? "bg-gray-700" : "bg-blue-50"} rounded-lg`}
          >
            <p className={`${textPrimary} leading-relaxed text-sm`}>
              {plan.summary}
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {/* BMI */}
            <Col xs={24} sm={12}>
              <div
                className={`p-3 ${isDark ? "bg-blue-900" : "bg-blue-50"} rounded-lg`}
              >
                <div
                  className={`text-sm ${isDark ? "text-blue-300" : "text-gray-600"} mb-1`}
                >
                  {locale === "en" ? "BMI Index" : "Chỉ Số BMI"}
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {plan.bmi}
                </div>
                <Badge
                  color={getBMIColor(plan.bmiCategory)}
                  text={plan.bmiCategory}
                  className="mt-2"
                />
              </div>
            </Col>

            {/* Timeline */}
            <Col xs={24} sm={12}>
              <div
                className={`p-3 ${isDark ? "bg-green-900" : "bg-green-50"} rounded-lg`}
              >
                <div
                  className={`text-sm ${isDark ? "text-green-300" : "text-gray-600"} mb-1`}
                >
                  {locale === "en"
                    ? "Timeline to Goal"
                    : "Thời Gian Đạt Mục Tiêu"}
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {plan.timeline.weeksToGoal}{" "}
                  {locale === "en" ? "weeks" : "tuần"}
                </div>
                <div
                  className={`text-xs ${isDark ? "text-green-400" : "text-gray-600"} mt-1`}
                >
                  (~{Math.round(plan.timeline.weeksToGoal / 4)}{" "}
                  {locale === "en" ? "months" : "tháng"})
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 2. Exercise Calendar Chart */}
      <Card
        className={`${cardBg} border ${borderColor} rounded-lg page-break-after`}
      >
        <ExerciseChart
          exerciseCalendar={plan.exerciseCalendar}
          locale={locale}
        />
      </Card>

      {/* 3. Nutrition Insights with Charts */}
      <Card
        className={`${cardBg} border ${borderColor} rounded-lg page-break-after`}
      >
        <NutritionChart
          protein={plan.nutrition.protein}
          carbs={plan.nutrition.carbs}
          fat={plan.nutrition.fat}
          locale={locale}
        />
      </Card>

      {/* Daily Calorie Breakdown */}
      <Card
        className={`${cardBg} border ${borderColor} rounded-lg page-break-after`}
        title={
          <div className="flex items-center gap-2">
            <FireOutlined className="text-red-500" />
            <span className={textPrimary}>
              {locale === "en" ? "Daily Nutrition" : "Dinh Dưỡng Hàng Ngày"}
            </span>
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <div
              className={`p-3 ${isDark ? "bg-red-900" : "bg-red-50"} rounded-lg`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-semibold ${isDark ? "text-red-300" : "text-gray-700"}`}
                >
                  {locale === "en" ? "Daily Calories" : "Calo/Ngày"}
                </span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {plan.nutrition.dailyCalories} kcal
                </span>
              </div>
              <Progress
                percent={100}
                showInfo={false}
                strokeColor={{ from: "#ff4d4f", to: "#ffa940" }}
              />
            </div>
          </Col>

          {/* Macros */}
          <Col xs={24} sm={8}>
            <div
              className={`p-3 ${isDark ? "bg-purple-900" : "bg-purple-50"} rounded-lg text-center`}
            >
              <div
                className={`text-xs ${isDark ? "text-purple-300" : "text-gray-600"} mb-1`}
              >
                Protein
              </div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {plan.nutrition.protein}g
              </div>
              <div
                className={`text-xs ${isDark ? "text-purple-400" : "text-gray-500"} mt-1`}
              >
                {Math.round(
                  ((plan.nutrition.protein * 4) /
                    plan.nutrition.dailyCalories) *
                    100,
                )}
                %
              </div>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div
              className={`p-3 ${isDark ? "bg-yellow-900" : "bg-yellow-50"} rounded-lg text-center`}
            >
              <div
                className={`text-xs ${isDark ? "text-yellow-300" : "text-gray-600"} mb-1`}
              >
                Carbs
              </div>
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {plan.nutrition.carbs}g
              </div>
              <div
                className={`text-xs ${isDark ? "text-yellow-400" : "text-gray-500"} mt-1`}
              >
                {Math.round(
                  ((plan.nutrition.carbs * 4) / plan.nutrition.dailyCalories) *
                    100,
                )}
                %
              </div>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <div
              className={`p-3 ${isDark ? "bg-pink-900" : "bg-pink-50"} rounded-lg text-center`}
            >
              <div
                className={`text-xs ${isDark ? "text-pink-300" : "text-gray-600"} mb-1`}
              >
                Fat
              </div>
              <div className="text-xl font-bold text-pink-600 dark:text-pink-400">
                {plan.nutrition.fat}g
              </div>
              <div
                className={`text-xs ${isDark ? "text-pink-400" : "text-gray-500"} mt-1`}
              >
                {Math.round(
                  ((plan.nutrition.fat * 9) / plan.nutrition.dailyCalories) *
                    100,
                )}
                %
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 4. Weight Progress Chart */}
      <Card
        className={`${cardBg} border ${borderColor} rounded-lg page-break-after`}
      >
        <ProgressChart
          currentWeight={userData?.weight || 70}
          goalWeight={userData?.goalWeight || 60}
          weeksToGoal={plan.timeline.weeksToGoal}
          locale={locale}
        />
      </Card>

      {/* 5. Timeline & Tips */}
      <Card
        className={`${cardBg} border ${borderColor} rounded-lg`}
        title={
          <div className="flex items-center gap-2">
            <LineChartOutlined className="text-blue-500" />
            <span className={textPrimary}>
              {locale === "en" ? "Timeline & Tips" : "Lộ Trình & Lời Khuyên"}
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Timeline */}
          <div
            className={`p-3 ${isDark ? "bg-blue-900" : "bg-blue-50"} rounded-lg`}
          >
            <div className="flex items-center gap-2 mb-2">
              <CalendarOutlined className="text-blue-600 dark:text-blue-400" />
              <span
                className={`font-semibold ${isDark ? "text-blue-300" : "text-gray-700"}`}
              >
                {locale === "en" ? "Estimated Timeline" : "Thời Gian Dự Kiến"}
              </span>
            </div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {plan.timeline.weeksToGoal} {locale === "en" ? "weeks" : "tuần"} (
              {Math.round(plan.timeline.weeksToGoal / 4)}{" "}
              {locale === "en" ? "months" : "tháng"})
            </div>
            <div
              className={`text-sm ${isDark ? "text-blue-400" : "text-gray-600"} mt-1`}
            >
              {locale === "en" ? "Weekly loss rate: " : "Mức giảm/tuần: "}
              <span className="font-semibold">
                {plan.timeline.weeklyWeightLoss} kg/tuần
              </span>
            </div>
          </div>

          <Divider />

          {/* Tips */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircleOutlined className="text-green-600 dark:text-green-400" />
              <span
                className={`font-semibold ${isDark ? "text-green-300" : "text-gray-700"}`}
              >
                {locale === "en" ? "Tips" : "Lời Khuyên"}
              </span>
            </div>
            <Space direction="vertical" className="w-full">
              <Tag icon={<FireOutlined />} color="blue">
                💧{" "}
                {locale === "en"
                  ? "Drink enough water (2-3L/day)"
                  : "Uống đủ nước (2-3 lít/ngày)"}
              </Tag>
              <Tag icon={<FireOutlined />} color="cyan">
                😴{" "}
                {locale === "en"
                  ? "Get 7-8 hours of sleep daily"
                  : "Ngủ đủ 7-8 tiếng/ngày"}
              </Tag>
              <Tag icon={<FireOutlined />} color="green">
                📊{" "}
                {locale === "en"
                  ? "Stay consistent & track weight"
                  : "Kiên trì & check weight thường xuyên"}
              </Tag>
              <Tag icon={<FireOutlined />} color="orange">
                🏥{" "}
                {locale === "en"
                  ? "Consult doctor if needed"
                  : "Tư vấn bác sĩ nếu cần"}
              </Tag>
            </Space>
          </div>

          <Divider />

          {/* Download Button */}
          <Button
            block
            type="primary"
            icon={<DownloadOutlined style={{ fontSize: 16 }} />}
            onClick={handleExportPDF}
            className="rounded-lg h-9"
          >
            {locale === "en"
              ? "📥 Download Your Plan"
              : "📥 Tải Lộ Trình Của Bạn"}
          </Button>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className={`${cardBg} border ${borderColor} rounded-lg`}>
        <div
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} text-center`}
        >
          <p>
            ⚠️{" "}
            {locale === "en"
              ? "This plan is for reference only. Please consult a doctor or nutritionist before starting any weight loss program."
              : "Lộ trình này chỉ mang tính chất tham khảo. Vui lòng tư vấn với bác sĩ hoặc dinh dưỡng sĩ trước khi bắt đầu bất kỳ chương trình giảm cân nào."}
          </p>
        </div>
      </Card>
    </div>
  );
}
