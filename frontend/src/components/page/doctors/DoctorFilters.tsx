import { Input, Select, Card, Row, Col, Button } from "antd";
import { SearchOutlined, FilterOutlined, StarFilled } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { specializations } from "@/utils/specializations";

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
            {specializations?.map((spec) => (
              <Option key={spec.value} value={spec.value}>
                {t(spec.labelKey)}
              </Option>
            ))}
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
            <Option value={4.5}>
              <StarFilled style={{ color: "gold" }} /> {t("ratings.rating_4_5")}
            </Option>
            <Option value={4.0}>
              <StarFilled style={{ color: "gold" }} /> {t("ratings.rating_4_0")}
            </Option>
            <Option value={3.5}>
              <StarFilled style={{ color: "gold" }} /> {t("ratings.rating_3_5")}
            </Option>
            <Option value={3.0}>
              <StarFilled style={{ color: "gold" }} /> {t("ratings.rating_3_0")}
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
