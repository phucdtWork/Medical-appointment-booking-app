import React from "react";
import { TimePicker, Button, Select, Divider, Switch } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { WeeklySchedule, TimeRange } from "@/lib/services/scheduleService";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

interface WorkingHoursFormProps {
  workingHours: WeeklySchedule;
  slotDuration: 30 | 60;
  onChange: (workingHours: WeeklySchedule, slotDuration: 30 | 60) => void;
}

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

const WorkingHoursForm: React.FC<WorkingHoursFormProps> = ({
  workingHours,
  slotDuration,
  onChange,
}) => {
  const t = useTranslations("doctorDetail.booking");
  const { isDark } = useTheme();
  const handleDayChange = (day: keyof WeeklySchedule, ranges: TimeRange[]) => {
    onChange(
      {
        ...workingHours,
        [day]: ranges,
      },
      slotDuration
    );
  };

  const handleAddRange = (day: keyof WeeklySchedule) => {
    const currentRanges = workingHours[day];
    handleDayChange(day, [...currentRanges, { start: "09:00", end: "17:00" }]);
  };

  const handleRemoveRange = (day: keyof WeeklySchedule, index: number) => {
    const currentRanges = workingHours[day];
    handleDayChange(
      day,
      currentRanges.filter((_, i) => i !== index)
    );
  };

  const handleRangeChange = (
    day: keyof WeeklySchedule,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const currentRanges = [...workingHours[day]];
    currentRanges[index] = {
      ...currentRanges[index],
      [field]: value,
    };
    handleDayChange(day, currentRanges);
  };

  const handleSlotDurationChange = (value: 30 | 60) => {
    onChange(workingHours, value);
  };

  return (
    <div className={`space-y-6 ${isDark ? "text-white" : "text-black"}`}>
      {/* Slot Duration Selector */}
      <div
        className={`p-4 rounded-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-gray-50"}`}
      >
        <label
          className={`block text-sm font-medium mb-F2 ${isDark ? "text-text-primary-dark" : "text-text-primary"}`}
        >
          {t("selectTime") || "Appointment Slot Duration"}
        </label>
        <Select
          value={slotDuration}
          onChange={handleSlotDurationChange}
          style={{ width: 200 }}
          options={[
            { label: t("slotDuration30") || "30 minutes", value: 30 },
            { label: t("slotDuration60") || "60 minutes", value: 60 },
          ]}
        />
      </div>

      <Divider />

      {/* Weekly Schedule */}
      <div className="space-y-4">
        {DAYS.map(({ key, label }) => {
          const ranges = workingHours[key];
          const isWorking = ranges.length > 0;

          return (
            <div
              key={key}
              className={`${isDark ? "border-gray-700" : "border"} rounded-lg p-4`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-base">
                  {t(label) || label}
                </span>
                <Switch
                  checked={isWorking}
                  onChange={(checked) => {
                    if (checked) {
                      handleDayChange(key, [{ start: "09:00", end: "17:00" }]);
                    } else {
                      handleDayChange(key, []);
                    }
                  }}
                  checkedChildren={t("working") || "Working"}
                  unCheckedChildren={t("dayOff") || "Day Off"}
                />
              </div>

              {isWorking && (
                <div className="space-y-2">
                  {ranges.map((range, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <TimePicker
                        format="HH:mm"
                        value={dayjs(range.start, "HH:mm")}
                        onChange={(time) =>
                          handleRangeChange(
                            key,
                            index,
                            "start",
                            time?.format("HH:mm") || "09:00"
                          )
                        }
                        minuteStep={30}
                      />
                      <span
                        className={`${isDark ? "text-text-secondary-dark" : "text-text-secondary"}`}
                      >
                        to
                      </span>
                      <TimePicker
                        format="HH:mm"
                        value={dayjs(range.end, "HH:mm")}
                        onChange={(time) =>
                          handleRangeChange(
                            key,
                            index,
                            "end",
                            time?.format("HH:mm") || "17:00"
                          )
                        }
                        minuteStep={30}
                      />
                      {ranges.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveRange(key, index)}
                        />
                      )}
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddRange(key)}
                    block
                    size="small"
                  >
                    {t("addTimeRange") || "Add Time Range"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkingHoursForm;
