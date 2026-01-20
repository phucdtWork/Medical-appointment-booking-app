import { NextRequest, NextResponse } from "next/server";

interface UserData {
  name: string;
  age: number;
  weight: number;
  height: number;
  goalWeight: number;
  exerciseTime: number;
}

interface WeightLossPlan {
  summary: string;
  bmi: number;
  bmiCategory: string;
  exerciseCalendar: Array<{
    day: string;
    activity: string;
    duration: number;
    calories: number;
  }>;
  nutrition: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  timeline: {
    weeksToGoal: number;
    weeklyWeightLoss: string;
  };
}

function generateWeightLossPlan(
  userData: UserData,
  locale: string = "vi",
): WeightLossPlan {
  const { name, age, weight, height, goalWeight, exerciseTime } = userData;

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi =
    Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;

  // Determine BMI category
  let bmiCategory = locale === "en" ? "Normal" : "Bình thường";
  if (bmi < 18.5) bmiCategory = locale === "en" ? "Underweight" : "Thiếu cân";
  else if (bmi < 25) bmiCategory = locale === "en" ? "Normal" : "Bình thường";
  else if (bmi < 30) bmiCategory = locale === "en" ? "Overweight" : "Thừa cân";
  else bmiCategory = locale === "en" ? "Obese" : "Béo phì";

  // Calculate weight loss required
  const weightToLose = Math.max(0, weight - goalWeight);
  const weeklyWeightLoss = 0.5; // Safe: 0.5kg per week
  const weeksNeeded = Math.ceil(weightToLose / weeklyWeightLoss);

  // Calculate daily calories (simplified Harris-Benedict)
  const bmr =
    10 * weight + 6.25 * height - 5 * age + (gender === "male" ? 5 : -161);
  let activityFactor = 1.2; // sedentary
  if (exerciseTime > 0 && exerciseTime < 30) activityFactor = 1.375;
  else if (exerciseTime >= 30 && exerciseTime < 60) activityFactor = 1.55;
  else if (exerciseTime >= 60) activityFactor = 1.725;

  const maintenanceCalories = bmr * activityFactor;
  const dailyCalories = Math.round(maintenanceCalories - 500); // 500 calorie deficit

  // Generate exercise calendar
  const exerciseCalendar = generateExerciseSchedule(exerciseTime, locale);

  // Calculate macros (40% carbs, 30% protein, 30% fat)
  const protein = Math.round((dailyCalories * 0.3) / 4); // 4 cal per gram
  const carbs = Math.round((dailyCalories * 0.4) / 4);
  const fat = Math.round((dailyCalories * 0.3) / 9); // 9 cal per gram

  const summary =
    locale === "en"
      ? `
🎯 **Health Analysis**
Hello ${name}! Based on your information:
- **Current BMI:** ${bmi} (${bmiCategory})
- **Goal:** Lose ${weightToLose}kg
- **Expected timeline:** ${weeksNeeded} weeks (~${Math.round(weeksNeeded / 4)} months)
- **Safe weight loss rate:** ${weeklyWeightLoss}kg/week

This plan combines a ${dailyCalories} calories/day diet with ${exerciseTime} minutes/day of exercise.
      `
      : `
🎯 **Phân tích sức khỏe**
Xin chào ${name}! Dựa trên thông tin của bạn:
- **BMI hiện tại:** ${bmi} (${bmiCategory})
- **Mục tiêu:** Giảm ${weightToLose}kg
- **Thời gian dự kiến:** ${weeksNeeded} tuần (~${Math.round(weeksNeeded / 4)} tháng)
- **Mức giảm cân an toàn:** ${weeklyWeightLoss}kg/tuần

Lộ trình này kết hợp chế độ ăn ${dailyCalories} calories/ngày và lịch tập luyện ${exerciseTime} phút/ngày.
      `;

  return {
    summary: summary.trim(),
    bmi,
    bmiCategory,
    exerciseCalendar,
    nutrition: {
      dailyCalories,
      protein,
      carbs,
      fat,
    },
    timeline: {
      weeksToGoal: weeksNeeded,
      weeklyWeightLoss: `${weeklyWeightLoss}kg`,
    },
  };
}

function generateExerciseSchedule(exerciseTime: number, locale: string = "vi") {
  const activities =
    locale === "en"
      ? [
          { day: "Monday", activity: "Jogging", duration: 30, calories: 250 },
          {
            day: "Tuesday",
            activity: "Strength Training",
            duration: 45,
            calories: 300,
          },
          {
            day: "Wednesday",
            activity: "Cycling",
            duration: 40,
            calories: 280,
          },
          {
            day: "Thursday",
            activity: "Swimming",
            duration: 35,
            calories: 320,
          },
          { day: "Friday", activity: "Yoga", duration: 30, calories: 150 },
          { day: "Saturday", activity: "HIIT", duration: 25, calories: 350 },
          {
            day: "Sunday",
            activity: "Rest / Light Walk",
            duration: 20,
            calories: 100,
          },
        ]
      : [
          { day: "Thứ Hai", activity: "Chạy bộ", duration: 30, calories: 250 },
          {
            day: "Thứ Ba",
            activity: "Tập lực",
            duration: 45,
            calories: 300,
          },
          {
            day: "Thứ Tư",
            activity: "Đạp xe",
            duration: 40,
            calories: 280,
          },
          {
            day: "Thứ Năm",
            activity: "Bơi lội",
            duration: 35,
            calories: 320,
          },
          { day: "Thứ Sáu", activity: "Yoga", duration: 30, calories: 150 },
          { day: "Thứ Bảy", activity: "HIIT", duration: 25, calories: 350 },
          {
            day: "Chủ Nhật",
            activity: "Nghỉ / Đi bộ nhẹ",
            duration: 20,
            calories: 100,
          },
        ];

  if (exerciseTime === 0) {
    const restLabel = locale === "en" ? "Rest Day" : "Ngày nghỉ";
    return activities.map((a) => ({ ...a, duration: 0, activity: restLabel }));
  }

  const scaleFactor = exerciseTime / 30; // Base is 30 minutes
  return activities.map((a) => ({
    ...a,
    duration: Math.round(a.duration * scaleFactor),
    calories: Math.round(a.calories * scaleFactor),
  }));
}

const gender = "male"; // Default, can be extended

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData: UserData = body;
    const locale = body.locale || "vi"; // Default to Vietnamese

    // Validate input
    if (
      !userData.name ||
      !userData.age ||
      !userData.weight ||
      !userData.height ||
      !userData.goalWeight ||
      userData.exerciseTime === undefined
    ) {
      const errorMsg =
        locale === "en"
          ? "Missing required fields"
          : "Thiếu các trường bắt buộc";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Validate ranges
    if (userData.weight <= userData.goalWeight) {
      const errorMsg =
        locale === "en"
          ? "Goal weight must be less than current weight"
          : "Cân nặng mục tiêu phải nhỏ hơn cân nặng hiện tại";
      return NextResponse.json(
        {
          error: errorMsg,
          plan: generateWeightLossPlan(userData, locale), // Still generate for visualization
        },
        { status: 400 },
      );
    }

    const plan = generateWeightLossPlan(userData, locale);

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("[Weight Loss API] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to generate weight loss plan: ${errorMessage}` },
      { status: 500 },
    );
  }
}
