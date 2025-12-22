import React from "react";
import { Button, TimePicker } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { TimeRange } from "@/lib/services/scheduleService";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

interface BreakTimesManagerProps {
  breakTimes: TimeRange[];
  onChange: (breakTimes: TimeRange[]) => void;
}

const BreakTimesManager: React.FC<BreakTimesManagerProps> = ({
  breakTimes,
  onChange,
}) => {
  const t = useTranslations("scheduleManager");
  const { isDark } = useTheme();
  const handleAdd = () => {
    onChange([...breakTimes, { start: "12:00", end: "13:00" }]);
  };

  const handleRemove = (index: number) => {
    onChange(breakTimes.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updated = [...breakTimes];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
        {t("breakTimes.description") ||
          "Break times apply to all working days. Appointments cannot be booked during these times."}
      </p>

      <div className="space-y-3">
        {breakTimes.map((breakTime, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <TimePicker
              format="HH:mm"
              value={dayjs(breakTime.start, "HH:mm")}
              onChange={(time) =>
                handleChange(index, "start", time?.format("HH:mm") || "12:00")
              }
              minuteStep={30}
            />
            <span
              className={`${isDark ? "text-text-secondary-dark" : "text-text-secondary"}`}
            >
              {t("breakTimes.to") || "to"}
            </span>
            <TimePicker
              format="HH:mm"
              value={dayjs(breakTime.end, "HH:mm")}
              onChange={(time) =>
                handleChange(index, "end", time?.format("HH:mm") || "13:00")
              }
              minuteStep={30}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(index)}
            />
          </div>
        ))}
      </div>

      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAdd} block>
        {t("breakTimes.addButton") || "Add Break Time"}
      </Button>
    </div>
  );
};

export default BreakTimesManager;
