import { useClassName } from "@/hooks";
import { Segmented } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface DoctorViewControlsProps {
  totalItems: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function DoctorViewControls({
  totalItems,
  viewMode,
  onViewModeChange,
}: DoctorViewControlsProps) {
  const t = useTranslations("doctors");

  return (
    <div className="flex flex-col mt-2.5 sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Results Count */}
      <div>
        <p
          className={`text-base ${useClassName(
            "text-text-secondary",
            "text-text-secondary-dark"
          )}`}
        >
          {t("page.results")}
          <strong
            className={`text-lg ${useClassName(
              "text-text-primary",
              "text-text-primary-dark"
            )}`}
          >{` ${totalItems} `}</strong>
          {t("page.doctors")}
        </p>
      </div>

      {/* View Mode Toggle */}
      <Segmented
        value={viewMode}
        onChange={(value) => onViewModeChange(value as "grid" | "list")}
        size="large"
        options={[
          {
            label: t("page.grid"),
            value: "grid",
            icon: <AppstoreOutlined />,
          },
          {
            label: t("page.list"),
            value: "list",
            icon: <UnorderedListOutlined />,
          },
        ]}
      />
    </div>
  );
}
