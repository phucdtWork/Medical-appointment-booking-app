import { Button, Row, Col, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useDoctors } from "@/hooks";
import { useTranslations } from "next-intl";
import DoctorCard from "@/components/ui/DoctorCard";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";
import type { Doctor } from "@/types/doctor";

export default function FeaturedDoctorsSection() {
  const t = useTranslations("home");
  const router = useRouter();
  const { isDark } = useTheme();
  const { data: doctorsData } = useDoctors({});
  const featuredDoctors = (doctorsData?.data as Doctor[])?.slice(0, 4) || [];

  return (
    <section
      id="doctors"
      className={`py-20 ${isDark ? "bg-background-dark" : "bg-gray-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-text-primary-dark" : "text-text-primary"
            }`}
          >
            {t("doctors.title")}
          </h2>
          <p
            className={`text-xl ${
              isDark ? "text-text-secondary-dark" : "text-text-secondary"
            }`}
          >
            {t("doctors.subtitle")}
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {featuredDoctors.length > 0
            ? featuredDoctors.map((doctor) => (
                <Col xs={24} sm={12} lg={6} key={doctor?.id}>
                  <DoctorCard doctor={doctor} />
                </Col>
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card
                    className={`text-center ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white"
                    }`}
                  >
                    <div
                      className={`h-48 rounded mb-4 ${
                        isDark ? "bg-slate-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-4 rounded mb-2 ${
                        isDark ? "bg-slate-700" : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-4 rounded w-3/4 mx-auto ${
                        isDark ? "bg-slate-700" : "bg-gray-200"
                      }`}
                    ></div>
                  </Card>
                </Col>
              ))}
        </Row>

        <div className="text-center mt-12">
          <Button
            type="primary"
            size="large"
            icon={<RightOutlined />}
            iconPosition="end"
            className={`h-12 px-8 font-medium transition-all hover:shadow-lg ${
              isDark
                ? "bg-primary-color hover:bg-blue-600 border-primary-color"
                : ""
            }`}
            onClick={() => router.push("/doctors")}
          >
            {t("doctors.viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}
