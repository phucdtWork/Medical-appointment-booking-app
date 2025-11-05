"use client";

import { useState } from "react";
import {
  Input,
  Select,
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  Tag,
  Rate,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useDoctors } from "@/hooks";
import Link from "next/link";
import Image from "next/image";

const { Option } = Select;

export default function DoctorsPage() {
  const [filters, setFilters] = useState({
    specialization: undefined,
    minRating: undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useDoctors(filters);

  // Filter doctors by search term (client-side)
  const filteredDoctors = data?.data.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ specialization: undefined, minRating: undefined });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Danh sách bác sĩ
          </h1>
          <p className="text-gray-600">
            Tìm bác sĩ phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input
                size="large"
                placeholder="Tìm kiếm bác sĩ..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Select
                size="large"
                placeholder="Chuyên khoa"
                style={{ width: "100%" }}
                value={filters.specialization}
                onChange={(value) =>
                  handleFilterChange("specialization", value)
                }
                allowClear
              >
                <Option value="Tim mạch">Tim mạch</Option>
                <Option value="Da liễu">Da liễu</Option>
                <Option value="Nội khoa">Nội khoa</Option>
                <Option value="Nhi khoa">Nhi khoa</Option>
                <Option value="Sản phụ khoa">Sản phụ khoa</Option>
                <Option value="Ngoại khoa">Ngoại khoa</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Select
                size="large"
                placeholder="Đánh giá"
                style={{ width: "100%" }}
                value={filters.minRating}
                onChange={(value) => handleFilterChange("minRating", value)}
                allowClear
              >
                <Option value={4.5}>⭐ 4.5 trở lên</Option>
                <Option value={4.0}>⭐ 4.0 trở lên</Option>
                <Option value={3.5}>⭐ 3.5 trở lên</Option>
              </Select>
            </Col>

            <Col xs={24} md={6}>
              <Button icon={<FilterOutlined />} onClick={clearFilters} block>
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Results Count */}
        {data && (
          <div className="mb-4">
            <p className="text-gray-600">
              Tìm thấy <strong>{filteredDoctors?.length || 0}</strong> bác sĩ
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" tip="Đang tải danh sách bác sĩ..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="text-center py-10">
            <Empty description="Không thể tải danh sách bác sĩ" />
          </Card>
        )}

        {/* Doctors Grid */}
        {!isLoading && !error && (
          <>
            {filteredDoctors && filteredDoctors.length > 0 ? (
              <Row gutter={[16, 16]}>
                {filteredDoctors.map((doctor) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={doctor.id}>
                    <Card
                      hoverable
                      className="h-full shadow-sm hover:shadow-lg transition-shadow"
                      cover={
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                          <Image
                            src={
                              doctor.avatar ||
                              `https://i.pravatar.cc/150?u=${doctor.id}`
                            }
                            alt={doctor.fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      }
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {doctor.fullName}
                        </h3>

                        <Tag color="blue" className="mb-3">
                          {doctor.doctorInfo.specialization}
                        </Tag>

                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Rate
                            disabled
                            defaultValue={doctor.doctorInfo.rating}
                            allowHalf
                            className="text-sm"
                          />
                          <span className="text-gray-600 text-sm">
                            ({doctor.doctorInfo.totalReviews})
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">
                          {doctor.doctorInfo.yearsOfExperience} năm kinh nghiệm
                        </p>

                        <p className="text-blue-600 font-bold mb-4">
                          {doctor.doctorInfo.consultationFee.min.toLocaleString()}
                          đ -{" "}
                          {doctor.doctorInfo.consultationFee.max.toLocaleString()}
                          đ
                        </p>

                        <Link href={`/doctors/${doctor.id}`}>
                          <Button type="primary" block>
                            Xem chi tiết & Đặt lịch
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center py-10">
                <Empty description="Không tìm thấy bác sĩ phù hợp" />
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
