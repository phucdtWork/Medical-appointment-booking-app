"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "antd";

interface ProgressChartProps {
  currentWeight: number;
  goalWeight: number;
  weeksToGoal: number;
  locale?: string;
}

export default function ProgressChart({
  currentWeight,
  goalWeight,
  weeksToGoal,
  locale = "vi",
}: ProgressChartProps) {
  // Generate weight loss progression data
  const weeklyLossRate = (currentWeight - goalWeight) / weeksToGoal;
  const chartData = Array.from({ length: weeksToGoal + 1 }, (_, i) => ({
    week: i,
    weight: Math.round((currentWeight - weeklyLossRate * i) * 10) / 10,
  }));

  return (
    <Card
      className="w-full"
      title={locale === "en" ? "Weight Progress" : "Tiến Trình Giảm Cân"}
    >
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">
            {locale === "en" ? "Current" : "Hiện Tại"}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {currentWeight} kg
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600">
            {locale === "en" ? "Target" : "Mục Tiêu"}
          </div>
          <div className="text-2xl font-bold text-green-600">
            {goalWeight} kg
          </div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-sm text-gray-600">
            {locale === "en" ? "To Lose" : "Cần Giảm"}
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {(currentWeight - goalWeight).toFixed(1)} kg
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            label={{
              value: locale === "en" ? "Week" : "Tuần",
              position: "insideBottomRight",
              offset: -10,
            }}
          />
          <YAxis
            label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #ccc" }}
            formatter={(value) => `${value} kg`}
          />
          <Legend />
          <ReferenceLine
            y={goalWeight}
            stroke="#10b981"
            strokeDasharray="5 5"
            label={locale === "en" ? "Goal" : "Mục Tiêu"}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name={locale === "en" ? "Weight" : "Cân Nặng"}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
