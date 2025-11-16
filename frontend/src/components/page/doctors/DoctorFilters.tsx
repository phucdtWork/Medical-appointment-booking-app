import { Input, Select, Card, Row, Col, Button } from "antd";
import { SearchOutlined, FilterOutlined, StarFilled } from "@ant-design/icons";
import { useTranslations } from "next-intl";

const { Option } = Select;

interface DoctorFiltersProps {
  searchTerm: string;
  filters: {
    specialization?: string;
    minRating?: number;
  };
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

export default function DoctorFilters({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}: DoctorFiltersProps) {
  const t = useTranslations("doctors");

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm || filters.specialization || filters.minRating;

  return (
    <Card className="mb-6 shadow-sm">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={8}>
          <Input
            size="large"
            placeholder={t("page.searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
          />
        </Col>

        {/* Specialization Filter */}
        <Col xs={24} sm={12} md={5}>
          <Select
            size="large"
            placeholder={t("page.specializationPlaceholder")}
            style={{ width: "100%" }}
            value={filters.specialization}
            onChange={(value) => onFilterChange("specialization", value)}
            allowClear
          >
            <Option value="Tim mạch">{t("specializations.cardiology")}</Option>
            <Option value="Da liễu">{t("specializations.dermatology")}</Option>
            <Option value="Nội khoa">{t("specializations.internal")}</Option>
            <Option value="Nhi khoa">{t("specializations.pediatrics")}</Option>
            <Option value="Sản phụ khoa">
              {t("specializations.obstetrics")}
            </Option>
            <Option value="Ngoại khoa">{t("specializations.surgery")}</Option>
            <Option value="Thần kinh">{t("specializations.neurology")}</Option>
            <Option value="Mắt">{t("specializations.ophthalmology")}</Option>
            <Option value="Tai Mũi Họng">{t("specializations.ent")}</Option>
          </Select>
        </Col>

        {/* Rating Filter */}
        <Col xs={24} sm={12} md={5}>
          <Select
            size="large"
            placeholder={t("page.ratingPlaceholder")}
            style={{ width: "100%" }}
            value={filters.minRating}
            onChange={(value) => onFilterChange("minRating", value)}
            allowClear
          >
            <Option Option value={4.5}>
              <StarFilled className="text-yellow-400" />{" "}
              {t("ratings.rating_4_5")}
            </Option>
            <Option value={4.0}>
              <StarFilled className="text-yellow-400" />{" "}
              {t("ratings.rating_4_0")}
            </Option>
            <Option value={3.5}>
              <StarFilled className="text-yellow-400" />{" "}
              {t("ratings.rating_3_5")}
            </Option>
            <Option value={3.0}>
              <StarFilled className="text-yellow-400" />{" "}
              {t("ratings.rating_3_0")}
            </Option>
          </Select>
        </Col>

        {/* Clear Filters Button */}
        <Col xs={24} md={6}>
          <Button
            size="large"
            icon={<FilterOutlined />}
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            block
          >
            {t("page.clearFilters")}
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
