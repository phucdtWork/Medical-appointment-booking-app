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
import { useTranslations } from "next-intl";

interface ProgressChartProps {
  currentWeight: number;
  goalWeight: number;
  weeksToGoal: number;
}

export default function ProgressChart({
  currentWeight,
  goalWeight,
  weeksToGoal,
}: ProgressChartProps) {
  const t = useTranslations("chat");
  // Generate weight loss progression data
  const weeklyLossRate = (currentWeight - goalWeight) / weeksToGoal;
  const chartData = Array.from({ length: weeksToGoal + 1 }, (_, i) => ({
    week: i,
    weight: Math.round((currentWeight - weeklyLossRate * i) * 10) / 10,
  }));

  return (
    <Card className="w-full" title={t("weightProgress")}>
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">{t("currentWeight")}</div>
          <div className="text-2xl font-bold text-blue-600">
            {currentWeight} kg
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-600">{t("goalWeight")}</div>
          <div className="text-2xl font-bold text-green-600">
            {goalWeight} kg
          </div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-sm text-gray-600">{t("weightToLose")}</div>
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
              value: t("weekLabel"),
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
            label={t("targetLabel")}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name={t("currentWeight")}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
