import { NextRequest, NextResponse } from "next/server";

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Define all available features
const FEATURES_EN: Feature[] = [
  {
    id: "doctor_search",
    name: "Doctor Search",
    description: "Search for doctors by name, specialty, location, and ratings",
    category: "Appointment Management",
  },
  {
    id: "appointment_booking",
    name: "Appointment Booking",
    description: "Book appointments with doctors at available time slots",
    category: "Appointment Management",
  },
  {
    id: "appointment_reschedule",
    name: "Appointment Rescheduling",
    description:
      "Reschedule your existing appointments to a different date/time",
    category: "Appointment Management",
  },
  {
    id: "appointment_cancellation",
    name: "Appointment Cancellation",
    description: "Cancel your appointments if needed",
    category: "Appointment Management",
  },
  {
    id: "doctor_ratings",
    name: "Doctor Ratings & Reviews",
    description: "View and submit reviews and ratings for doctors",
    category: "Doctor Information",
  },
  {
    id: "doctor_profile",
    name: "Doctor Profile",
    description:
      "View detailed doctor profiles with specialization, experience, and fees",
    category: "Doctor Information",
  },
  {
    id: "medical_history",
    name: "Medical History Management",
    description:
      "Maintain and manage your medical records and health information",
    category: "Health Records",
  },
  {
    id: "health_ai_chat",
    name: "Health AI Assistant",
    description:
      "Chat with AI for health advice, information, and personalized recommendations",
    category: "Health Services",
  },
  {
    id: "weight_loss_plan",
    name: "Weight Loss Plan Generator",
    description:
      "Generate personalized weight loss plans based on your health metrics",
    category: "Health Services",
  },
  {
    id: "appointment_history",
    name: "Appointment History",
    description: "View your past and upcoming appointments",
    category: "Appointment Management",
  },
  {
    id: "notifications",
    name: "Appointment Notifications",
    description: "Receive notifications and reminders for your appointments",
    category: "Notifications",
  },
  {
    id: "multiple_languages",
    name: "Multi-Language Support",
    description: "Use the application in English or Vietnamese",
    category: "Accessibility",
  },
  {
    id: "dark_mode",
    name: "Dark Mode",
    description: "Switch between light and dark theme for comfortable viewing",
    category: "Accessibility",
  },
];

const FEATURES_VI: Feature[] = [
  {
    id: "doctor_search",
    name: "Tìm Kiếm Bác Sĩ",
    description: "Tìm kiếm bác sĩ theo tên, chuyên khoa, địa điểm và đánh giá",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "appointment_booking",
    name: "Đặt Lịch Hẹn",
    description: "Đặt lịch khám với bác sĩ tại các khung giờ khả dụng",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "appointment_reschedule",
    name: "Dời Lịch Hẹn",
    description: "Dời lịch khám của bạn sang ngày/giờ khác",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "appointment_cancellation",
    name: "Hủy Lịch Hẹn",
    description: "Hủy các lịch khám của bạn nếu cần",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "doctor_ratings",
    name: "Đánh Giá & Nhận Xét Bác Sĩ",
    description: "Xem và gửi đánh giá, nhận xét cho bác sĩ",
    category: "Thông Tin Bác Sĩ",
  },
  {
    id: "doctor_profile",
    name: "Hồ Sơ Bác Sĩ",
    description:
      "Xem hồ sơ chi tiết bác sĩ với chuyên khoa, kinh nghiệm và phí khám",
    category: "Thông Tin Bác Sĩ",
  },
  {
    id: "medical_history",
    name: "Quản Lý Lịch Sử Y Tế",
    description: "Lưu trữ và quản lý hồ sơ y tế cá nhân của bạn",
    category: "Hồ Sơ Sức Khỏe",
  },
  {
    id: "health_ai_chat",
    name: "Trợ Lý AI Sức Khỏe",
    description:
      "Trò chuyện với AI để nhận lời khuyên sức khỏe, thông tin và đề xuất cá nhân hóa",
    category: "Dịch Vụ Sức Khỏe",
  },
  {
    id: "weight_loss_plan",
    name: "Tạo Lộ Trình Giảm Cân",
    description:
      "Tạo lộ trình giảm cân được cá nhân hóa dựa trên chỉ số sức khỏe của bạn",
    category: "Dịch Vụ Sức Khỏe",
  },
  {
    id: "appointment_history",
    name: "Lịch Sử Lịch Hẹn",
    description: "Xem các lịch hẹn quá khứ và sắp tới",
    category: "Quản Lý Lịch Hẹn",
  },
  {
    id: "notifications",
    name: "Thông Báo Lịch Hẹn",
    description: "Nhận thông báo và nhắc nhở về lịch khám của bạn",
    category: "Thông Báo",
  },
  {
    id: "multiple_languages",
    name: "Hỗ Trợ Đa Ngôn Ngữ",
    description: "Sử dụng ứng dụng bằng tiếng Anh hoặc tiếng Việt",
    category: "Khả Năng Truy Cập",
  },
  {
    id: "dark_mode",
    name: "Chế Độ Tối",
    description: "Chuyển đổi giữa giao diện sáng và tối để xem thoải mái",
    category: "Khả Năng Truy Cập",
  },
];

function getFeaturesByLocale(locale: string): Feature[] {
  return locale === "en" ? FEATURES_EN : FEATURES_VI;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "");
}

function calculateRelevance(query: string, feature: Feature): number {
  const normalizedQuery = normalizeText(query);
  const normalizedName = normalizeText(feature.name);
  const normalizedDesc = normalizeText(feature.description);
  const normalizedCategory = normalizeText(feature.category);

  let score = 0;

  // Check exact match in name
  if (normalizedName === normalizedQuery) score += 100;
  // Check if name contains query
  else if (normalizedName.includes(normalizedQuery)) score += 50;
  // Check if query contains name
  else if (normalizedQuery.includes(normalizedName)) score += 40;

  // Check partial match in description
  if (normalizedDesc.includes(normalizedQuery)) score += 30;

  // Check category match
  if (normalizedCategory.includes(normalizedQuery)) score += 20;

  // Check for keyword matches
  const keywords = normalizedQuery.split(/\s+/);
  keywords.forEach((keyword) => {
    if (normalizedName.includes(keyword) || normalizedDesc.includes(keyword)) {
      score += 5;
    }
  });

  return score;
}

function findRelatedFeatures(
  query: string,
  features: Feature[],
  limit: number = 3,
): Feature[] {
  return features
    .map((feature) => ({
      feature,
      score: calculateRelevance(query, feature),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.feature);
}

function generateAnswer(
  query: string,
  relatedFeatures: Feature[],
  locale: string,
): { answer: string; isRelevant: boolean } {
  if (relatedFeatures.length === 0) {
    const notSupported =
      locale === "en"
        ? "I'm sorry, but I currently don't support answering questions about that topic. I can help you with information about our app's features like doctor search, appointments, health AI assistance, and personalized health plans. Would you like to know about any of these features?"
        : "Xin lỗi, tôi hiện chưa hỗ trợ trả lời câu hỏi về vấn đề đó. Tôi có thể giúp bạn với thông tin về các tính năng của ứng dụng như tìm kiếm bác sĩ, đặt lịch hẹn, trợ lý sức khỏe AI và kế hoạch sức khỏe được cá nhân hóa. Bạn có muốn biết về các tính năng này không?";

    return { answer: notSupported, isRelevant: false };
  }

  let answer = "";

  if (locale === "en") {
    answer = `Based on your question, here are the relevant features:\n\n`;
    relatedFeatures.forEach((feature) => {
      answer += `• **${feature.name}** (${feature.category})\n  ${feature.description}\n\n`;
    });
    answer += `Is there anything specific about these features you'd like to know more about?`;
  } else {
    answer = `Dựa trên câu hỏi của bạn, dưới đây là các tính năng liên quan:\n\n`;
    relatedFeatures.forEach((feature) => {
      answer += `• **${feature.name}** (${feature.category})\n  ${feature.description}\n\n`;
    });
    answer += `Bạn có muốn biết thêm chi tiết về các tính năng này không?`;
  }

  return { answer, isRelevant: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query: string = body.query || "";
    const locale = body.locale || "vi";

    if (!query.trim()) {
      const errorMsg =
        locale === "en"
          ? "Please enter a question about our features"
          : "Vui lòng nhập câu hỏi về các tính năng";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const features = getFeaturesByLocale(locale);
    const relatedFeatures = findRelatedFeatures(query, features);
    const { answer, isRelevant } = generateAnswer(
      query,
      relatedFeatures,
      locale,
    );

    return NextResponse.json(
      {
        success: true,
        answer,
        isRelevant,
        features: relatedFeatures,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Features API] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to process features request",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
