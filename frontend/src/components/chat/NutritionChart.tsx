"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "antd";
import { useTranslations } from "next-intl";

interface NutritionChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

export default function NutritionChart({
  protein,
  carbs,
  fat,
}: NutritionChartProps) {
  const t = useTranslations("chat");
  // Calculate calories from macros (protein 4cal/g, carbs 4cal/g, fat 9cal/g)
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatCals = fat * 9;
  const totalCals = proteinCals + carbsCals + fatCals;

  const data = [
    {
      name: t("protein"),
      value: Math.round((proteinCals / totalCals) * 100),
      grams: protein,
    },
    {
      name: t("carbs"),
      value: Math.round((carbsCals / totalCals) * 100),
      grams: carbs,
    },
    {
      name: t("fatLabel"),
      value: Math.round((fatCals / totalCals) * 100),
      grams: fat,
    },
  ];

  const COLORS = ["#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <Card className="w-full h-96" title={t("nutritionAnalysis")}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{ background: "#fff", border: "1px solid #ccc" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {data.map((item, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
            <div
              className="text-sm font-semibold"
              style={{ color: COLORS[idx] }}
            >
              {item.name}
            </div>
            <div className="text-lg font-bold text-gray-900">{item.grams}g</div>
            <div className="text-xs text-gray-600">{item.value}%</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
