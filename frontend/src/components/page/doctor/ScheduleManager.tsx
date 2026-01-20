import React, { useState, useEffect } from "react";
import { Card, Tabs, Button, message, Spin, Tag } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import WorkingHoursForm from "./WorkingHoursForm";
import BlockedDatesManager from "./BlockedDatesManager";
import BreakTimesManager from "./BreakTimesManager";
import scheduleService, {
  DoctorSchedule,
} from "@/lib/services/scheduleService";
import { useTranslations } from "next-intl";
import { useTheme } from "@/providers/ThemeProvider";

interface ScheduleManagerProps {
  doctorId: string;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ doctorId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [schedule, setSchedule] = useState<DoctorSchedule | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const t = useTranslations("scheduleManager");
  const { isDark } = useTheme();

  // Load existing schedule
  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getSchedule(doctorId);
      setSchedule(data);
    } catch (error: { response?: { status: number } } | unknown) {
      if (
        error instanceof Object &&
        "response" in error &&
        (error as Record<string, unknown>).response &&
        ((error as Record<string, unknown>).response as Record<
          string,
          unknown
        >) &&
        ((error as Record<string, unknown>).response as Record<string, unknown>)
          .status === 404
      ) {
        // No schedule yet, create default
        setSchedule({
          doctorId,
          workingHours: {
            monday: [{ start: "09:00", end: "17:00" }],
            tuesday: [{ start: "09:00", end: "17:00" }],
            wednesday: [{ start: "09:00", end: "17:00" }],
            thursday: [{ start: "09:00", end: "17:00" }],
            friday: [{ start: "09:00", end: "17:00" }],
            saturday: [],
            sunday: [],
          },
          slotDuration: 30,
          breakTimes: [{ start: "12:00", end: "13:00" }],
          blockedDates: [],
          customSchedules: [],
          timezone: "Asia/Ho_Chi_Minh",
          allowDoubleBooking: false,
        });
      } else {
        messageApi.error(t("loadFailed") || "Failed to load schedule");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, messageApi, t]);

  const handleSave = async () => {
    if (!schedule) return;

    try {
      setSaving(true);
      await scheduleService.upsertSchedule(schedule);
      messageApi.success(t("saveSuccess") || "Schedule saved successfully!");
      setHasChanges(false);

      // Reload to get updated data
      await loadSchedule();
    } catch (error) {
      messageApi.error(t("saveFailed") || "Failed to save schedule");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const updateSchedule = (updates: Partial<DoctorSchedule>) => {
    setSchedule((prev) => (prev ? { ...prev, ...updates } : null));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <Card>
        <div className="text-center py-8">
          <p>
            {t("noScheduleCreating") ||
              "No schedule found. Creating default schedule..."}
          </p>
        </div>
      </Card>
    );
  }

  const tabItems = [
    {
      key: "working-hours",
      label: (
        <span>
          <ClockCircleOutlined /> {t("tabs.workingHours") || "Working Hours"}
        </span>
      ),
      children: (
        <WorkingHoursForm
          workingHours={schedule.workingHours}
          slotDuration={schedule.slotDuration}
          onChange={(workingHours, slotDuration) =>
            updateSchedule({ workingHours, slotDuration })
          }
        />
      ),
    },
    {
      key: "break-times",
      label: (
        <span>
          <ClockCircleOutlined /> {t("tabs.breakTimes") || "Break Times"}
        </span>
      ),
      children: (
        <BreakTimesManager
          breakTimes={schedule.breakTimes}
          onChange={(breakTimes) => updateSchedule({ breakTimes })}
        />
      ),
    },
    {
      key: "blocked-dates",
      label: (
        <span>
          <CalendarOutlined /> {t("tabs.blockedDates") || "Blocked Dates"}
        </span>
      ),
      children: (
        <BlockedDatesManager
          blockedDates={schedule.blockedDates}
          onChange={(blockedDates) => updateSchedule({ blockedDates })}
        />
      ),
    },
  ];

  return (
    <div className={`max-w-7xl mx-auto`}>
      {contextHolder}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span
              className={`text-xl font-semibold ${isDark ? "text-white" : "text-black"}`}
            >
              {t("title") || "Schedule Management"}
            </span>
            {hasChanges && (
              <Tag color="orange">
                {t("unsavedChanges") || "Unsaved Changes"}
              </Tag>
            )}
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            disabled={!hasChanges}
            onClick={handleSave}
          >
            {t("saveChanges") || "Save Changes"}
          </Button>
        }
      >
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default ScheduleManager;
