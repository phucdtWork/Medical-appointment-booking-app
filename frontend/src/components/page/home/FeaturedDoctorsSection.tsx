import { Button, Row, Col, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useClassName, useDoctors } from "@/hooks";
import { useTranslations } from "next-intl";
import DoctorCard from "@/components/ui/DoctorCard";

export default function FeaturedDoctorsSection() {
  const t = useTranslations("home");
  const { data: doctorsData } = useDoctors({});
  const featuredDoctors = doctorsData?.data.slice(0, 4) || [];

  return (
    <section
      id="doctors"
      className={`py-20 ${useClassName("bg-gray-100", "bg-background-dark")}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-4 ${useClassName(
              "text-text-primary",
              "text-text-primary-dark"
            )}`}
          >
            {t("doctors.title")}
          </h2>
          <p
            className={`text-xl ${useClassName(
              "text-text-secondary",
              "text-text-secondary-dark"
            )}`}
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
            <Button
              size="large"
              variant="outlined"
              color="primary"
              className="h-12 px-8"
            >
              {t("doctors.viewAll")} <RightOutlined />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
