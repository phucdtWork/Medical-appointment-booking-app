// ============================================
// HOME/LANDING PAGE
// src/app/page.tsx
// ============================================
"use client";

import { Button, Card, Row, Col, Statistic, Rate } from "antd";
import {
  RightOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useDoctors } from "@/hooks";

export default function HomePage() {
  // Fetch featured doctors
  const { data: doctorsData } = useDoctors({});

  console.log("doctorsData", doctorsData);

  const featuredDoctors = doctorsData?.data.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* ==================== HEADER/NAVBAR ==================== */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="text-2xl font-bold text-gray-800">MediBook</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Tính năng
              </Link>
              <Link
                href="#doctors"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Bác sĩ
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Cách hoạt động
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Liên hệ
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button size="large">Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button type="primary" size="large">
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Đặt lịch khám bệnh
                  <span className="block text-blue-600">
                    Dễ dàng & Nhanh chóng
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                  Kết nối bạn với hơn 500+ bác sĩ chuyên nghiệp. Đặt lịch khám
                  chỉ trong vài phút, mọi lúc mọi nơi.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button
                      type="primary"
                      size="large"
                      className="h-14 px-8 text-lg font-medium"
                    >
                      Bắt đầu ngay <RightOutlined />
                    </Button>
                  </Link>
                  <Link href="/doctors">
                    <Button size="large" className="h-14 px-8 text-lg">
                      Tìm bác sĩ
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">500+</div>
                    <div className="text-gray-600">Bác sĩ</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">10k+</div>
                    <div className="text-gray-600">Bệnh nhân</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      4.9⭐
                    </div>
                    <div className="text-gray-600">Đánh giá</div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className="relative">
                {/* Illustration/Image placeholder */}
                <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🏥</div>
                      <p className="text-2xl font-semibold text-gray-700">
                        Healthcare Made Easy
                      </p>
                    </div>
                  </div>

                  {/* Floating cards animation */}
                  <div className="absolute top-10 right-10 bg-white p-4 rounded-xl shadow-lg animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        ✅
                      </div>
                      <div>
                        <div className="font-bold">Đặt lịch thành công</div>
                        <div className="text-sm text-gray-500">
                          BS. Nguyễn A
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-10 left-10 bg-white p-4 rounded-xl shadow-lg animate-float-delayed">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        📅
                      </div>
                      <div>
                        <div className="font-bold">Lịch hẹn sắp tới</div>
                        <div className="text-sm text-gray-500">
                          Hôm nay, 10:00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn MediBook?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nền tảng đặt lịch khám bệnh hiện đại, tiện lợi và an toàn
            </p>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TeamOutlined className="text-4xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">500+ Bác sĩ</h3>
                <p className="text-gray-600">
                  Đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm từ các bệnh
                  viện hàng đầu
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ClockCircleOutlined className="text-4xl text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Đặt lịch 24/7</h3>
                <p className="text-gray-600">
                  Đặt lịch khám bất cứ lúc nào, mọi nơi chỉ với vài thao tác đơn
                  giản
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <SafetyCertificateOutlined className="text-4xl text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">An toàn & Bảo mật</h3>
                <p className="text-gray-600">
                  Thông tin cá nhân và y tế được bảo vệ tuyệt đối với công nghệ
                  mã hóa hiện đại
                </p>
              </Card>
            </Col>
          </Row>

          {/* Additional Features */}
          <Row gutter={[32, 32]} className="mt-8">
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-bold mb-3">Thanh toán linh hoạt</h3>
                <p className="text-gray-600">
                  Hỗ trợ nhiều hình thức thanh toán
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-3">Nhắc nhở thông minh</h3>
                <p className="text-gray-600">
                  Thông báo tự động trước lịch khám
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-3">Đánh giá chất lượng</h3>
                <p className="text-gray-600">Phản hồi từ bệnh nhân thực tế</p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* ==================== FEATURED DOCTORS ==================== */}
      <section id="doctors" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🔥 Bác sĩ nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Các bác sĩ được đánh giá cao nhất trên MediBook
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {featuredDoctors.length > 0
              ? featuredDoctors.map((doctor) => (
                  <Col xs={24} sm={12} lg={6} key={doctor.id}>
                    <Card
                      hoverable
                      className="text-center h-full shadow-sm hover:shadow-xl transition-all"
                      cover={
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                          <Image
                            src={doctor.avatar || ""}
                            alt={doctor.fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      }
                    >
                      <h3 className="text-lg font-bold mb-2">
                        {doctor.fullName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {doctor.doctorInfo.specialization}
                      </p>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Rate
                          disabled
                          defaultValue={doctor.doctorInfo.rating}
                          allowHalf
                          className="text-sm"
                        />
                        <span className="text-gray-500 text-sm">
                          ({doctor.doctorInfo.totalReviews})
                        </span>
                      </div>
                      <p className="text-blue-600 font-bold mb-4">
                        {doctor.doctorInfo.consultationFee.min.toLocaleString()}
                        đ
                      </p>
                      <Link href={`/doctors/${doctor.id}`}>
                        <Button type="primary" block>
                          Đặt lịch ngay
                        </Button>
                      </Link>
                    </Card>
                  </Col>
                ))
              : // Skeleton/Placeholder
                Array.from({ length: 4 }).map((_, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card className="text-center">
                      <div className="h-48 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </Card>
                  </Col>
                ))}
          </Row>

          <div className="text-center mt-12">
            <Link href="/doctors">
              <Button size="large" className="h-12 px-8">
                Xem tất cả bác sĩ <RightOutlined />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cách hoạt động
            </h2>
            <p className="text-xl text-gray-600">
              Đặt lịch khám chỉ với 3 bước đơn giản
            </p>
          </div>

          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Tìm bác sĩ</h3>
                <p className="text-gray-600">
                  Tìm kiếm bác sĩ theo chuyên khoa, địa điểm hoặc đánh giá
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Đặt lịch</h3>
                <p className="text-gray-600">
                  Chọn ngày, giờ phù hợp và điền thông tin lý do khám
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Nhận xác nhận</h3>
                <p className="text-gray-600">
                  Bác sĩ xác nhận và bạn nhận thông báo qua email/SMS
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={12} md={6}>
              <Statistic
                title={
                  <span className="text-white text-opacity-90">Bác sĩ</span>
                }
                value={500}
                suffix="+"
                valueStyle={{
                  color: "white",
                  fontSize: "3rem",
                  fontWeight: "bold",
                }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={
                  <span className="text-white text-opacity-90">Bệnh nhân</span>
                }
                value={10000}
                suffix="+"
                valueStyle={{
                  color: "white",
                  fontSize: "3rem",
                  fontWeight: "bold",
                }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={
                  <span className="text-white text-opacity-90">Lịch hẹn</span>
                }
                value={50000}
                suffix="+"
                valueStyle={{
                  color: "white",
                  fontSize: "3rem",
                  fontWeight: "bold",
                }}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={
                  <span className="text-white text-opacity-90">Đánh giá</span>
                }
                value={4.9}
                suffix="/5 ⭐"
                valueStyle={{
                  color: "white",
                  fontSize: "3rem",
                  fontWeight: "bold",
                }}
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tham gia cùng hàng ngàn bệnh nhân đã tin tưởng sử dụng MediBook
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                className="h-14 px-10 text-lg font-medium"
              >
                Đăng ký miễn phí
              </Button>
            </Link>
            <Link href="/doctors">
              <Button size="large" className="h-14 px-10 text-lg">
                Tìm bác sĩ ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <span className="text-2xl font-bold">MediBook</span>
              </div>
              <p className="text-gray-400 mb-4">
                Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Instagram
                </a>
              </div>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <h3 className="text-lg font-bold mb-4">Sản phẩm</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/doctors"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Tìm bác sĩ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Đăng ký
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Ứng dụng Mobile
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <h3 className="text-lg font-bold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <h3 className="text-lg font-bold mb-4">Pháp lý</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Chính sách cookie
                  </a>
                </li>
              </ul>
            </Col>
          </Row>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediBook. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
}
