"use client";

import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  Tag,
  Tabs,
  Modal,
  Input,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useDoctorAppointments, useUpdateAppointmentStatus } from "@/hooks";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const { data, isLoading } = useDoctorAppointments(
    activeTab === "all" ? undefined : activeTab
  );
  const updateMutation = useUpdateAppointmentStatus();

  const [rejectModal, setRejectModal] = useState<{
    visible: boolean;
    appointmentId: string | null;
  }>({ visible: false, appointmentId: null });
  const [rejectionReason, setRejectionReason] = useState("");

  const appointments = data?.data || [];

  // Stats
  const pendingCount = appointments.filter(
    (apt) => apt.status === "pending"
  ).length;
  const todayAppointments = appointments.filter(
    (apt) =>
      apt.status === "confirmed" && dayjs(apt.date).isSame(dayjs(), "day")
  );

  const handleConfirm = (id: string) => {
    updateMutation.mutate({
      id,
      data: { status: "confirmed" },
    });
  };

  const handleReject = (id: string) => {
    setRejectModal({ visible: true, appointmentId: id });
  };

  const confirmReject = () => {
    if (!rejectModal.appointmentId) return;

    updateMutation.mutate(
      {
        id: rejectModal.appointmentId,
        data: {
          status: "rejected",
          rejectionReason: rejectionReason || "Lịch bận, không thể khám",
        },
      },
      {
        onSuccess: () => {
          setRejectModal({ visible: false, appointmentId: null });
          setRejectionReason("");
        },
      }
    );
  };

  const renderAppointmentCard = (apt: any) => (
    <Card key={apt.id} className="mb-4 shadow-sm">
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {apt.patientInfo?.fullName || "Bệnh nhân"}
              </h3>
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p>📧 {apt.patientInfo?.email}</p>
                <p>📞 {apt.patientInfo?.phone}</p>
                <p>
                  📅 {dayjs(apt.date).format("DD/MM/YYYY")} • ⏰{" "}
                  {apt.timeSlot.start} - {apt.timeSlot.end}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Lý do khám:
                </p>
                <p className="text-sm text-gray-600">{apt.reason}</p>
                {apt.notes && (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-1 mt-2">
                      Ghi chú:
                    </p>
                    <p className="text-sm text-gray-600">{apt.notes}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} md={8} className="text-right">
          <p className="text-lg font-bold text-cyan-600 mb-4">
            {apt.fee.toLocaleString()}đ
          </p>

          {apt.status === "pending" && (
            <div className="space-y-2">
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleConfirm(apt.id)}
                loading={updateMutation.isPending}
                block
              >
                Xác nhận
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(apt.id)}
                loading={updateMutation.isPending}
                block
              >
                Từ chối
              </Button>
            </div>
          )}

          {apt.status === "confirmed" && (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Đã xác nhận
            </Tag>
          )}

          {apt.status === "rejected" && (
            <div>
              <Tag color="red" icon={<CloseCircleOutlined />}>
                Đã từ chối
              </Tag>
              {apt.rejectionReason && (
                <p className="text-xs text-gray-500 mt-2">
                  {apt.rejectionReason}
                </p>
              )}
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Bác sĩ 👨‍⚕️
          </h1>
          <p className="text-gray-600">Quản lý lịch khám và bệnh nhân</p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm bg-orange-50">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-orange-500">
                {pendingCount}
              </div>
              <div className="text-gray-600 text-sm">Chờ duyệt</div>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm bg-green-50">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-500">
                {todayAppointments.length}
              </div>
              <div className="text-gray-600 text-sm">Hôm nay</div>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm bg-blue-50">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-blue-500">
                {appointments.length}
              </div>
              <div className="text-gray-600 text-sm">Tổng lịch hẹn</div>
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card className="text-center shadow-sm bg-purple-50">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-purple-500">4.9</div>
              <div className="text-gray-600 text-sm">Đánh giá</div>
            </Card>
          </Col>
        </Row>

        {/* Today's Schedule */}
        {todayAppointments.length > 0 && (
          <Card className="mb-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">📅 Lịch hẹn hôm nay</h3>
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-2"
              >
                <div>
                  <p className="font-medium">{apt.patientInfo?.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {apt.timeSlot.start} - {apt.timeSlot.end}
                  </p>
                </div>
                <Button type="primary">Bắt đầu khám</Button>
              </div>
            ))}
          </Card>
        )}

        {/* Appointments Tabs */}
        <Card className="shadow-sm">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane
              tab={
                <span>
                  <ClockCircleOutlined /> Chờ duyệt ({pendingCount})
                </span>
              }
              key="pending"
            >
              {appointments.length > 0 ? (
                appointments.map((apt, index) =>
                  renderAppointmentCard(apt, index)
                )
              ) : (
                <Empty description="Không có lịch hẹn chờ duyệt" />
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CheckCircleOutlined /> Đã xác nhận
                </span>
              }
              key="confirmed"
            >
              {appointments.length > 0 ? (
                appointments.map((apt, index) =>
                  renderAppointmentCard(apt, index)
                )
              ) : (
                <Empty description="Không có lịch hẹn đã xác nhận" />
              )}
            </TabPane>

            <TabPane tab={<span>📋 Tất cả</span>} key="all">
              {appointments.length > 0 ? (
                appointments.map((apt, index) =>
                  renderAppointmentCard(apt, index)
                )
              ) : (
                <Empty description="Chưa có lịch hẹn" />
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* Reject Modal */}
        <Modal
          title="Từ chối lịch hẹn"
          open={rejectModal.visible}
          onOk={confirmReject}
          onCancel={() =>
            setRejectModal({ visible: false, appointmentId: null })
          }
          okText="Xác nhận từ chối"
          cancelText="Hủy"
          okButtonProps={{ danger: true, loading: updateMutation.isPending }}
        >
          <p className="mb-4">Vui lòng nhập lý do từ chối:</p>
          <TextArea
            rows={3}
            placeholder="Lý do từ chối (vd: Lịch bận, không thể khám...)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </Modal>
      </div>
    </div>
  );
}
