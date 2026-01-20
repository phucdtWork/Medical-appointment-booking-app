import { Button, Card, Rate, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { specializations } from "@/utils/specializations";
import type { Doctor } from "@/types/doctor";

interface DoctorCardProps {
  doctor: Partial<Doctor>;
  variant?: "vertical" | "horizontal";
}

export default function DoctorCard({
  doctor,
  variant = "vertical",
}: DoctorCardProps) {
  const t = useTranslations();
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // Function to get translated specialization label
  const getSpecializationLabel = (value?: string) => {
    if (!value) return "N/A";
    const spec = specializations.find((s) => s.value === value);
    return spec ? t(`components.ui.doctorCard.${spec.labelKey}`) : value;
  };

  // Render phí khám
  const renderFee = () => {
    const fee = doctor?.doctorInfo?.consultationFee;
    if (fee && typeof fee === "object" && "min" in fee && "max" in fee) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const min = (fee as any).min;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const max = (fee as any).max;
      return `${min?.toLocaleString?.() || min} - ${max?.toLocaleString?.() || max} VND`;
    }
    return "N/A";
  };

  // Render rating
  const renderRating = () => (
    <div className="flex items-center gap-1">
      <Rate
        disabled
        defaultValue={doctor?.doctorInfo?.rating}
        allowHalf
        className="text-sm"
      />
      <span className="text-sm text-gray-600">
        ({doctor?.doctorInfo?.totalReviews || 0})
      </span>
    </div>
  );

  // Vertical Layout (Mặc định)
  if (variant === "vertical") {
    return (
      <Card
        hoverable
        className="text-center h-full shadow-sm hover:shadow-xl transition-all"
        cover={
          <div className="relative h-48 bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            {!imageError && doctor?.avatar ? (
              <Image
                src={doctor.avatar}
                alt={`${t("components.ui.doctorCard.job")} ${doctor?.fullName || "Doctor"}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : null}
          </div>
        }
      >
        <h3 className="text-lg font-bold mb-2">
          {" "}
          {`${t("components.ui.doctorCard.job")} ${doctor?.fullName}`}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {getSpecializationLabel(doctor?.doctorInfo?.specialization)}
        </p>
        <div className="flex items-center justify-center gap-1 mb-3">
          {renderRating()}
        </div>
        <p className="text-blue-600 font-bold mb-4">{renderFee()}</p>
        <Button
          type="primary"
          block
          onClick={() => router.push(`/doctors/${doctor?.id}`)}
        >
          {t("components.ui.doctorCard.bookNow")}
        </Button>
      </Card>
    );
  }

  // Horizontal Layout
  if (variant === "horizontal") {
    return (
      <Card
        hoverable
        className="h-full shadow-sm hover:shadow-xl transition-all"
      >
        <div className="flex gap-4">
          <div className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            {!imageError && doctor?.avatar ? (
              <Image
                src={doctor.avatar}
                alt={doctor?.fullName || "Doctor"}
                fill
                sizes="160px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <Avatar
                size={120}
                icon={<UserOutlined className="text-3xl" />}
                style={{
                  backgroundColor: "var(--primary-color)",
                  fontSize: "32px",
                }}
              />
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-1">{doctor?.fullName}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {getSpecializationLabel(doctor?.doctorInfo?.specialization)}
            </p>
            {renderRating()}
            <p className="text-blue-600 font-bold mt-2">{renderFee()}</p>
            <div className="mt-auto pt-3">
              <Button
                type="primary"
                block
                onClick={() => router.push(`/doctors/${doctor?.id}`)}
              >
                {t("components.ui.doctorCard.bookNow")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
