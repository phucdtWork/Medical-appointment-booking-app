"use client";

import { Button, Card, Row, Col, Statistic, Rate } from "antd";
import {
  RightOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useDoctors } from "@/hooks";
import Header from "@/components/layout/Header";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  const { data: doctorsData } = useDoctors({});
  const featuredDoctors = doctorsData?.data.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO SECTION */}
      <section className="relative bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {t("hero.title")}
                  <span className="block text-blue-600">
                    {t("hero.titleHighlight")}
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                  {t("hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/register">
                    <Button
                      type="primary"
                      size="large"
                      className="h-14 px-8 text-lg font-medium"
                    >
                      {t("hero.startNow")} <RightOutlined />
                    </Button>
                  </Link>
                  <Link href="/doctors">
                    <Button size="large" className="h-14 px-8 text-lg">
                      {t("hero.findDoctor")}
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">500+</div>
                    <div className="text-gray-600">
                      {t("hero.stats.doctors")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">10k+</div>
                    <div className="text-gray-600">
                      {t("hero.stats.patients")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      4.9⭐
                    </div>
                    <div className="text-gray-600">
                      {t("hero.stats.rating")}
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className="relative">
                <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🏥</div>
                      <p className="text-2xl font-semibold text-gray-700">
                        {t("hero.tagline")}
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-10 right-10 bg-white p-4 rounded-xl shadow-lg animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        ✅
                      </div>
                      <div>
                        <div className="font-bold">
                          {t("hero.floatingCard1.title")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t("hero.floatingCard1.subtitle")}
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
                        <div className="font-bold">
                          {t("hero.floatingCard2.title")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t("hero.floatingCard2.subtitle")}
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

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("features.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TeamOutlined className="text-4xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {t("features.feature1.title")}
                </h3>
                <p className="text-gray-600">
                  {t("features.feature1.description")}
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ClockCircleOutlined className="text-4xl text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {t("features.feature2.title")}
                </h3>
                <p className="text-gray-600">
                  {t("features.feature2.description")}
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <SafetyCertificateOutlined className="text-4xl text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {t("features.feature3.title")}
                </h3>
                <p className="text-gray-600">
                  {t("features.feature3.description")}
                </p>
              </Card>
            </Col>
          </Row>

          <Row gutter={[32, 32]} className="mt-8">
            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-bold mb-3">
                  {t("features.feature4.title")}
                </h3>
                <p className="text-gray-600">
                  {t("features.feature4.description")}
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-3">
                  {t("features.feature5.title")}
                </h3>
                <p className="text-gray-600">
                  {t("features.feature5.description")}
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-bold mb-3">
                  {t("features.feature6.title")}
                </h3>
                <p className="text-gray-600">
                  {t("features.feature6.description")}
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section id="doctors" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("doctors.title")}
            </h2>
            <p className="text-xl text-gray-600">{t("doctors.subtitle")}</p>
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
                          {t("doctors.bookNow")}
                        </Button>
                      </Link>
                    </Card>
                  </Col>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
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
                {t("doctors.viewAll")} <RightOutlined />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("howItWorks.title")}
            </h2>
            <p className="text-xl text-gray-600">{t("howItWorks.subtitle")}</p>
          </div>

          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {t("howItWorks.step1.title")}
                </h3>
                <p className="text-gray-600">
                  {t("howItWorks.step1.description")}
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {t("howItWorks.step2.title")}
                </h3>
                <p className="text-gray-600">
                  {t("howItWorks.step2.description")}
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {t("howItWorks.step3.title")}
                </h3>
                <p className="text-gray-600">
                  {t("howItWorks.step3.description")}
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <Row gutter={[32, 32]}>
            <Col xs={12} md={6}>
              <Statistic
                title={
                  <span className="text-white text-opacity-90">
                    {t("stats.doctors")}
                  </span>
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
                  <span className="text-white text-opacity-90">
                    {t("stats.patients")}
                  </span>
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
                  <span className="text-white text-opacity-90">
                    {t("stats.appointments")}
                  </span>
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
                  <span className="text-white text-opacity-90">
                    {t("stats.rating")}
                  </span>
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

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-600 mb-8">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                type="primary"
                size="large"
                className="h-14 px-10 text-lg font-medium"
              >
                {t("cta.registerFree")}
              </Button>
            </Link>
            <Link href="/doctors">
              <Button size="large" className="h-14 px-10 text-lg">
                {t("cta.findDoctorNow")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
              <p className="text-gray-400 mb-4">{t("footer.description")}</p>
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
              <h3 className="text-lg font-bold mb-4">{t("footer.products")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/doctors"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.findDoctor")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.register")}
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.mobileApp")}
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <h3 className="text-lg font-bold mb-4">{t("footer.support")}</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.helpCenter")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.faq")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.contact")}
                  </a>
                </li>
              </ul>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <h3 className="text-lg font-bold mb-4">{t("footer.legal")}</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.terms")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.privacy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {t("footer.cookies")}
                  </a>
                </li>
              </ul>
            </Col>
          </Row>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>{t("footer.copyright")}</p>
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
