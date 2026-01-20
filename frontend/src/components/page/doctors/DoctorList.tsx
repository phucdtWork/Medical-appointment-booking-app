import { Row, Col, Card, Empty, Pagination, Skeleton } from "antd";
import DoctorCard from "@/components/ui/DoctorCard";
import { useTranslations } from "next-intl";

interface Doctor {
  id: string;
  fullName: string;
  avatar?: string;
  doctorInfo: {
    specialization: string;
    rating: number;
    totalReviews: number;
  };
}

interface DoctorListProps {
  doctors: Doctor[];
  isLoading: boolean;
  error: Error | null;
  viewMode: "grid" | "list";
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPaginationChange: (page: number, size: number) => void;
}

export default function DoctorList({
  doctors,
  isLoading,
  error,
  viewMode,
  currentPage,
  pageSize,
  totalItems,
  onPaginationChange,
}: DoctorListProps) {
  const t = useTranslations("doctors");

  if (isLoading) {
    return (
      <div>
        <Row gutter={[16, 16]}>
          {Array.from({ length: pageSize }).map((_, index) => (
            <Col
              xs={24}
              sm={viewMode === "grid" ? 12 : 24}
              md={viewMode === "grid" ? 8 : 12}
              lg={viewMode === "grid" ? 8 : 12}
              xl={viewMode === "grid" ? 6 : 8}
              key={index}
            >
              <Card className="h-full">
                {viewMode === "grid" ? (
                  <>
                    <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <Skeleton.Image
                        active
                        className="!w-full !h-full"
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      />
                    </div>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </>
                ) : (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Skeleton.Image
                        active
                        style={{ width: 160, height: 160 }}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <Skeleton active paragraph={{ rows: 3 }} />
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-10">
        <Empty
          description={
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                {t("page.loadingError")}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {t("page.loadingErrorDesc")}
              </p>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  // Empty State
  if (doctors.length === 0) {
    return (
      <Card className="text-center py-10">
        <Empty
          description={
            <div>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                {t("page.noResults")}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {t("page.noResultsDesc")}
              </p>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  // Doctors Grid/List View
  return (
    <>
      <Row gutter={[16, 16]}>
        {doctors.map((doctor, index) => (
          <Col
            xs={24}
            sm={viewMode === "grid" ? 12 : 24}
            md={viewMode === "grid" ? 8 : 12}
            lg={viewMode === "grid" ? 8 : 12}
            xl={viewMode === "grid" ? 6 : 8}
            key={`${doctor.id}-${index}`}
          >
            <DoctorCard
              doctor={doctor}
              variant={viewMode === "grid" ? "vertical" : "horizontal"}
            />
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={onPaginationChange}
            showSizeChanger
            pageSizeOptions={[12, 16, 24, 32]}
            showTotal={(total, range) =>
              t("page.pagination", {
                range0: range[0],
                range1: range[1],
                total,
              })
            }
            responsive
          />
        </div>
      )}
    </>
  );
}
