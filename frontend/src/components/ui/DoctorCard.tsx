import { Button, Card, Rate } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { specializations } from "@/utils/specializations";

interface DoctorCardProps {
  doctor: any;
  variant?: "vertical" | "horizontal";
}

export default function DoctorCard({
  doctor,
  variant = "vertical",
}: DoctorCardProps) {
  const t = useTranslations();

  // Function to get translated specialization label
  const getSpecializationLabel = (value: string) => {
    const spec = specializations.find((s) => s.value === value);
    return spec ? t(`components.ui.doctorCard.${spec.labelKey}`) : value;
  };

  // Render phí khám
  const renderFee = () => {
    const fee = doctor?.doctorInfo?.consultationFee;
    if (typeof fee === "object") {
      return `${fee.min.toLocaleString()} - ${fee.max.toLocaleString()} VND`;
    }
    return `${(fee || 0).toLocaleString()} VND`;
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
          <div className="relative h-48 bg-linear-to-br from-blue-100 to-purple-100">
            <Image
              src={
                doctor?.avatar ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={`${t("components.ui.doctorCard.job")} ${doctor?.fullName || "Doctor"}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
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
        <Link href={`/doctors/${doctor?.id}`}>
          <Button type="primary" size="medium" block>
            {t("components.ui.doctorCard.bookNow")}
          </Button>
        </Link>
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
          <div className="relative w-40 h-40 shrink-0 rounded-lg overflow-hidden bg-linear-to-br from-blue-100 to-purple-100">
            <Image
              src={
                doctor?.avatar ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={doctor?.fullName || "Doctor"}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-1">{doctor?.fullName}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {getSpecializationLabel(doctor?.doctorInfo?.specialization)}
            </p>
            {renderRating()}
            <p className="text-blue-600 font-bold mt-2">{renderFee()}</p>
            <div className="mt-auto pt-3">
              <Link href={`/doctors/${doctor?.id}`}>
                <Button type="primary" size="medium">
                  {t("components.ui.doctorCard.bookNow")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
