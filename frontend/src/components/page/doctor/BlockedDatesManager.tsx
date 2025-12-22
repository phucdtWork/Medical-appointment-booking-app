import React, { useState } from "react";
import { Button, DatePicker, List, Tag, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

interface BlockedDatesManagerProps {
  blockedDates: string[];
  onChange: (blockedDates: string[]) => void;
}

const BlockedDatesManager: React.FC<BlockedDatesManagerProps> = ({
  blockedDates,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const t = useTranslations("scheduleManager");
  const { isDark } = useTheme();

  const handleAdd = () => {
    if (!selectedDate) return;

    const dateStr = selectedDate.format("YYYY-MM-DD");
    if (blockedDates.includes(dateStr)) {
      return; // Already blocked
    }

    onChange([...blockedDates, dateStr].sort());
    setSelectedDate(null);
  };

  const handleRemove = (date: string) => {
    onChange(blockedDates.filter((d) => d !== date));
  };

  const disabledDate = (current: Dayjs) => {
    // Disable past dates
    return current && current < dayjs().startOf("day");
  };

  return (
    <div className="space-y-4">
      <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
        {t("blockedDates.description") ||
          "Block specific dates when you're not available (holidays, vacations, etc.)"}
      </p>

      {/* Add Date */}
      <div className="flex gap-2">
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          disabledDate={disabledDate}
          format="YYYY-MM-DD"
          placeholder={t("blockedDates.placeholder") || "Select date to block"}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          disabled={!selectedDate}
        >
          {t("blockedDates.blockButton") || "Block Date"}
        </Button>
      </div>

      {/* Blocked Dates List */}
      {blockedDates.length > 0 ? (
        <List
          dataSource={blockedDates.sort()}
          renderItem={(date) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(date)}
                />,
              ]}
            >
              <Space>
                <CalendarOutlined />
                <span className="font-medium">
                  {dayjs(date).format("dddd, MMMM D, YYYY")}
                </span>
                <Tag color="red">
                  {t("blockedDates.tagBlocked") || "Blocked"}
                </Tag>
              </Space>
            </List.Item>
          )}
          bordered
        />
      ) : (
        <div
          className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-400"}`}
        >
          {t("blockedDates.noBlocked") || "No blocked dates"}
        </div>
      )}
    </div>
  );
};

export default BlockedDatesManager;
