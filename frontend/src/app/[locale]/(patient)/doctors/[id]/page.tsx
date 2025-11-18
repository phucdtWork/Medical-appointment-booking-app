"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Spin,
  Button,
  Tabs,
  Rate,
  Tag,
  Form,
  DatePicker,
  Select,
  Input,
} from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useDoctor } from "@/hooks";
import { useCreateAppointment } from "@/hooks";
import Image from "next/image";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;

  const { data, isLoading, error } = useDoctor(doctorId);
  const createAppointmentMutation = useCreateAppointment();
  const [form] = Form.useForm();

  const doctor = data?.data;

  const timeSlots = [
    "08:00-08:30",
    "08:30-09:00",
    "09:00-09:30",
    "09:30-10:00",
    "10:00-10:30",
    "10:30-11:00",
    "14:00-14:30",
    "14:30-15:00",
    "15:00-15:30",
    "15:30-16:00",
  ];

  const onFinish = (values: any) => {
    const [start, end] = values.timeSlot.split("-");

    createAppointmentMutation.mutate(
      {
        doctorId,
        date: values.date.toDate(),
        timeSlot: { start, end },
        reason: values.reason,
        notes: values.notes,
        fee: doctor?.doctorInfo?.consultationFee?.min,
      },
      {
        onSuccess: () => {
          form.resetFields();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thông tin bác sĩ..." />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card>
          <p>Không tìm thấy thông tin bác sĩ</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Doctor Header */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={24}>
            <Col xs={24} md={8} className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <Image
                  src={
                    doctor?.avatar ||
                    `https://i.pravatar.cc/200?u=${doctor?.id}`
                  }
                  alt={doctor?.fullName}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </Col>

            <Col xs={24} md={16}>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {doctor?.fullName}
              </h1>

              <Tag color="blue" className="mb-3">
                {doctor?.doctorInfo?.specialization}
              </Tag>

              <div className="flex items-center gap-2 mb-3">
                <Rate
                  disabled
                  defaultValue={doctor?.doctorInfo?.rating}
                  allowHalf
                />
                <span className="text-gray-600">
                  {doctor?.doctorInfo?.rating} (
                  {doctor?.doctorInfo?.totalReviews} đánh giá)
                </span>
              </div>

              <div className="space-y-2 text-gray-600">
                <p>
                  <EnvironmentOutlined className="mr-2" />
                  {doctor?.doctorInfo?.hospital}
                </p>
                <p>
                  <ClockCircleOutlined className="mr-2" />
                  {doctor?.doctorInfo?.yearsOfExperience} năm kinh nghiệm
                </p>
                <p>
                  <DollarOutlined className="mr-2" />
                  <span className="text-blue-600 font-bold">
                    {doctor?.doctorInfo?.consultationFee?.min?.toLocaleString()}
                    đ -{" "}
                    {doctor?.doctorInfo?.consultationFee?.max?.toLocaleString()}
                    đ
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Left Column - Info */}
          <Col xs={24} lg={14}>
            <Card className="shadow-sm">
              <Tabs defaultActiveKey="1">
                <TabPane tab="Thông tin" key="1">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-3">🎓 Học vấn</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {doctor?.doctorInfo?.education?.map((edu, index) => (
                          <li key={index}>{edu}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3">💼 Kinh nghiệm</h3>
                      <p className="text-gray-600">{doctor?.doctorInfo?.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3">
                        🏥 Nơi công tác
                      </h3>
                      <p className="text-gray-600">
                        {doctor?.doctorInfo?.hospital}
                      </p>
                    </div>
                  </div>
                </TabPane>

                <TabPane tab="Đánh giá" key="2">
                  <div className="text-center py-10">
                    <p className="text-gray-500">Chưa có đánh giá</p>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* Right Column - Booking Form */}
          <Col xs={24} lg={10}>
            <Card className="shadow-sm sticky top-4">
              <h2 className="text-xl font-bold mb-6">📅 Đặt lịch khám</h2>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                size="large"
              >
                <Form.Item
                  label="Chọn ngày khám"
                  name="date"
                  rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                    placeholder="Chọn ngày"
                  />
                </Form.Item>

                <Form.Item
                  label="Chọn giờ khám"
                  name="timeSlot"
                  rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
                >
                  <Select placeholder="Chọn khung giờ">
                    {timeSlots.map((slot) => (
                      <Select.Option key={slot} value={slot}>
                        {slot}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Lý do khám"
                  name="reason"
                  rules={[
                    { required: true, message: "Vui lòng nhập lý do khám!" },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Mô tả triệu chứng hoặc lý do khám bệnh..."
                  />
                </Form.Item>

                <Form.Item label="Ghi chú (tùy chọn)" name="notes">
                  <TextArea rows={2} placeholder="Ghi chú thêm..." />
                </Form.Item>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chi phí khám:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {doctor?.doctorInfo?.consultationFee?.min?.toLocaleString()}
                      đ
                    </span>
                  </div>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={createAppointmentMutation.isPending}
                    block
                    size="large"
                  >
                    Đặt lịch khám
                  </Button>
                </Form.Item>

                <p className="text-sm text-gray-500 text-center">
                  Lịch hẹn sẽ được gửi đến bác sĩ để xác nhận
                </p>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
