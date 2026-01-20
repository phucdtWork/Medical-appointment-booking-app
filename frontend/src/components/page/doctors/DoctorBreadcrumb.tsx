import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";

interface DoctorBreadcrumbProps {
  filters: {
    specialization?: string;
    minRating?: number;
  };
  searchTerm?: string;
}

export default function DoctorBreadcrumb({
  filters,
  searchTerm,
}: DoctorBreadcrumbProps) {
  // Build dynamic breadcrumb items
  const items = [
    {
      title: (
        <Link href="/" className="flex items-center gap-1">
          <HomeOutlined />
          <span>Trang chủ</span>
        </Link>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-1">
          <UserOutlined />
          <span>Bác sĩ</span>
        </span>
      ),
    },
  ];

  // Add specialization to breadcrumb if selected
  if (filters.specialization) {
    items.push({
      title: filters.specialization as any,
    });
  }

  // Add search term to breadcrumb if exists
  if (searchTerm) {
    items.push({
      title: `Tìm kiếm: "${searchTerm}"` as any,
    });
  }

  // Add rating filter to breadcrumb if selected
  if (filters.minRating) {
    items.push({
      title: `⭐ ${filters.minRating}+ sao` as any,
    });
  }

  return <Breadcrumb items={items} className="mb-6" />;
}
