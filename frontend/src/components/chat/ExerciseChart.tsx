"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd";
import { useTranslations } from "next-intl";

interface ExerciseCalendarItem {
  day: string;
  activity: string;
  duration: number;
  calories: number;
}

interface ExerciseChartProps {
  exerciseCalendar: ExerciseCalendarItem[];
}

export default function ExerciseChart({
  exerciseCalendar,
}: ExerciseChartProps) {
  const t = useTranslations("chat");
  const chartData = exerciseCalendar.map((item) => ({
    day:
      {
        Monday: "Thứ 2",
        Tuesday: "Thứ 3",
        Wednesday: "Thứ 4",
        Thursday: "Thứ 5",
        Friday: "Thứ 6",
        Saturday: "Thứ 7",
        Sunday: "Chủ nhật",
      }[item.day] || item.day,
    calories: item.calories,
    duration: item.duration,
  }));

  const totalCalories = exerciseCalendar.reduce(
    (sum, e) => sum + e.calories,
    0,
  );
  const totalDuration = exerciseCalendar.reduce(
    (sum, e) => sum + e.duration,
    0,
  );

  return (
    <Card className="w-full" title={t("exerciseSchedule")}>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-sm text-gray-600">{t("totalDuration")}</div>
          <div className="text-2xl font-bold text-orange-600">
            {totalDuration} min
          </div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-sm text-gray-600">{t("totalCalories")}</div>
          <div className="text-2xl font-bold text-red-600">
            {totalCalories} kcal
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            label={{ value: "Calories", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Duration (min)",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip
            contentStyle={{ background: "#fff", border: "1px solid #ccc" }}
            formatter={(value) => value}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="calories"
            fill="#ef4444"
            name={t("calorieLabel")}
          />
          <Bar
            yAxisId="right"
            dataKey="duration"
            fill="#f59e0b"
            name={t("durationLabel")}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
