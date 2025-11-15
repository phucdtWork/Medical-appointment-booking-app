"use client";

import { Card, Row, Col, Spin, Empty, Button, Tag, Tabs } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useMyAppointments, useCancelAppointment } from "@/hooks";
import Link from "next/link";
import dayjs from "dayjs";

const { TabPane } = Tabs;

export default function PatientDashboard() {
  const { data, isLoading } = useMyAppointments();
  const cancelMutation = useCancelAppointment();

  const appointments = data?.data || [];

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "confirmed" && dayjs(apt.date).isAfter(dayjs())
  );
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || dayjs(apt.date).isBefore(dayjs())
  );

  const handleCancel = (id: string) => {
    if (confirm("Bạn có chắc muốn hủy lịch hẹn này?")) {
      cancelMutation.mutate(id);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<
      string,
      { color: string; text: string; icon: any }
    > = {
      pending: {
        color: "orange",
        text: "Chờ duyệt",
        icon: <ClockCircleOutlined />,
      },
      confirmed: {
        color: "green",
        text: "Đã xác nhận",
        icon: <CheckCircleOutlined />,
      },
      rejected: {
        color: "red",
        text: "Đã từ chối",
        icon: <CloseCircleOutlined />,
      },
      cancelled: {
        color: "default",
        text: "Đã hủy",
        icon: <CloseCircleOutlined />,
      },
      completed: {
        color: "blue",
        text: "Đã hoàn thành",
        icon: <CheckCircleOutlined />,
      },
    };

    const config = statusMap[status] || statusMap.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const renderAppointmentCard = (apt: any) => (
    <Card
      key={apt.id}
      className="mb-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {apt.doctorInfo?.fullName || "Bác sĩ"}
              </h3>
              <p className="text-gray-600 mb-2">
                {apt.doctorInfo?.specialization || "Chuyên khoa"}
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <CalendarOutlined className="mr-2" />
                  {dayjs(apt.date).format("DD/MM/YYYY")}
                </p>
                <p>
                  <ClockCircleOutlined className="mr-2" />
                  {apt.timeSlot.start} - {apt.timeSlot.end}
                </p>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Lý do:</strong> {apt.reason}
                </p>
                {apt.doctorNotes && (
                  <p className="text-sm text-gray-600">
                    <strong>Ghi chú của bác sĩ:</strong> {apt.doctorNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} md={8} className="text-right">
          <div className="mb-3">{getStatusTag(apt.status)}</div>
          <p className="text-lg font-bold text-blue-600 mb-4">
            {apt.fee.toLocaleString()}đ
          </p>
          {apt.status === "pending" && (
            <Button
              danger
              onClick={() => handleCancel(apt.id)}
              loading={cancelMutation.isPending}
              block
            >
              Hủy lịch hẹn
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải lịch hẹn..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Quản lý lịch khám của bạn</p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-orange-500">
                {pendingAppointments.length}
              </div>
              <div className="text-gray-600 text-sm">Chờ duyệt</div>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-500">
                {upcomingAppointments.length}
              </div>
              <div className="text-gray-600 text-sm">Sắp tới</div>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold text-blue-500">
                {pastAppointments.length}
              </div>
              <div className="text-gray-600 text-sm">Đã khám</div>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-purple-500">
                {appointments.length}
              </div>
              <div className="text-gray-600 text-sm">Tổng cộng</div>
            </Card>
          </Col>
        </Row>

        {/* Quick Action */}
        <Card className="mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Tìm bác sĩ</h3>
              <p className="text-gray-600">Đặt lịch khám với bác sĩ phù hợp</p>
            </div>
            <Link href="/doctors">
              <Button type="primary" size="large">
                Tìm bác sĩ →
              </Button>
            </Link>
          </div>
        </Card>

        {/* Appointments Tabs */}
        <Card className="shadow-sm">
          <Tabs defaultActiveKey="upcoming">
            <TabPane
              tab={`Sắp tới (${upcomingAppointments.length})`}
              key="upcoming"
            >
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(renderAppointmentCard)
              ) : (
                <Empty description="Không có lịch hẹn sắp tới" />
              )}
            </TabPane>

            <TabPane
              tab={`Chờ duyệt (${pendingAppointments.length})`}
              key="pending"
            >
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map(renderAppointmentCard)
              ) : (
                <Empty description="Không có lịch hẹn chờ duyệt" />
              )}
            </TabPane>

            <TabPane tab={`Đã khám (${pastAppointments.length})`} key="past">
              {pastAppointments.length > 0 ? (
                pastAppointments.map(renderAppointmentCard)
              ) : (
                <Empty description="Chưa có lịch sử khám bệnh" />
              )}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
