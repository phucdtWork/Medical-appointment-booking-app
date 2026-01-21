import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    // Weight loss plan generation - requires specific user data
    if (
      !userData.name ||
      !userData.weight ||
      !userData.height ||
      !userData.goalWeight
    ) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details:
            "Weight loss plan requires: name, weight, height, goalWeight",
        },
        { status: 400 },
      );
    }

    // Check if OpenAI API key is configured and valid
    const apiKey = process.env.OPENAI_API_KEY;
    const hasValidApiKey =
      apiKey && !apiKey.includes("/api") && apiKey.startsWith("sk-");

    if (!hasValidApiKey) {
      // Return mock data for development/localhost
      console.warn("OpenAI API key not properly configured, using mock data");
      return generateMockWeightLossPlan(userData);
    }

    // Generate health plan for weight loss data
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional health advisor AI. Generate a personalized health plan based on user data.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON (no markdown, no extra text, no code blocks)
2. exerciseCalendar MUST have EXACTLY 7 days (Monday to Sunday)
3. All numerical values must be realistic and based on the user's data
4. BMI calculation: weight(kg) / (height(m))^2

EXACT JSON FORMAT:
{
  "summary": "Brief health analysis in 2-3 sentences based on BMI and goals",
  "bmi": 23.5,
  "bmiCategory": "Normal",
  "exerciseCalendar": [
    {"day": "Monday", "activity": "Jogging", "duration": 30, "calories": 250},
    {"day": "Tuesday", "activity": "Strength Training", "duration": 45, "calories": 300},
    {"day": "Wednesday", "activity": "Cycling", "duration": 40, "calories": 280},
    {"day": "Thursday", "activity": "Swimming", "duration": 35, "calories": 320},
    {"day": "Friday", "activity": "Yoga", "duration": 30, "calories": 150},
    {"day": "Saturday", "activity": "HIIT", "duration": 25, "calories": 350},
    {"day": "Sunday", "activity": "Walking", "duration": 45, "calories": 200}
  ],
  "nutrition": {
    "dailyCalories": 2000,
    "protein": 30,
    "carbs": 50,
    "fat": 20
  },
  "weightProgress": [
    {"week": 0, "weight": 75},
    {"week": 4, "weight": 73},
    {"week": 8, "weight": 71},
    {"week": 12, "weight": 69}
  ],
  "bodyComposition": {
    "muscle": 35,
    "fat": 20,
    "water": 40,
    "bone": 5
  },
  "activityBreakdown": {
    "cardio": 40,
    "strength": 30,
    "stretching": 20,
    "rest": 10
  },
  "timeline": {
    "weeksToGoal": 12,
    "weeklyWeightLoss": "0.5kg"
  }
}

Generate realistic values based on:
- Current weight, height, age
- Goal weight
- Available exercise time per day
- Safe weight loss rate: 0.5-1kg per week`,
          },
          {
            role: "user",
            content: `Generate health plan for:
Name: ${userData.name}
Age: ${userData.age} years
Current Weight: ${userData.weight}kg
Height: ${userData.height}cm
Goal Weight: ${userData.goalWeight}kg
Exercise Time Available: ${userData.exerciseTime} minutes/day

Calculate realistic BMI, timeline, and exercise plan suitable for this person's time availability.`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        console.error("OpenAI API Error:", errorData);
        errorMessage = errorData.error?.message || response.statusText;
      } catch (e) {
        console.error("Failed to parse OpenAI error:", e);
      }

      // Handle specific errors
      if (response.status === 401) {
        throw new Error(
          `OpenAI API authentication failed: Invalid or expired API key. Status: ${response.status}`,
        );
      } else if (response.status === 429) {
        throw new Error(
          `OpenAI API rate limit exceeded. Please try again later. Status: ${response.status}`,
        );
      } else if (response.status === 500) {
        throw new Error(
          `OpenAI API server error. Please try again later. Status: ${response.status}`,
        );
      }

      throw new Error(
        `OpenAI API error: ${errorMessage} (Status: ${response.status})`,
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from OpenAI");
    }

    const plan = JSON.parse(data.choices[0].message.content);

    // Validate that we have 7 days
    if (!plan.exerciseCalendar || plan.exerciseCalendar.length !== 7) {
      console.error(
        "Invalid exerciseCalendar length:",
        plan.exerciseCalendar?.length,
      );
      throw new Error("Exercise calendar must have exactly 7 days");
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

function generateMockWeightLossPlan(userData: any) {
  const heightM = userData.height / 100;
  const bmi = userData.weight / (heightM * heightM);
  const weightDiff = userData.weight - userData.goalWeight;
  const weeksToGoal = Math.ceil((weightDiff / 0.5) * 1);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const plan = {
    summary: `Based on your current weight of ${userData.weight}kg and height of ${userData.height}cm, your BMI is ${bmi.toFixed(1)} (${getBMICategory(bmi)}). With a realistic weight loss rate of 0.5kg per week, you can reach your goal of ${userData.goalWeight}kg in approximately ${weeksToGoal} weeks.`,
    bmi: parseFloat(bmi.toFixed(1)),
    bmiCategory: getBMICategory(bmi),
    exerciseCalendar: [
      {
        day: "Monday",
        activity: "Running/Jogging",
        duration: Math.min(userData.exerciseTime, 40),
        calories: 300,
      },
      {
        day: "Tuesday",
        activity: "Strength Training",
        duration: Math.min(userData.exerciseTime, 45),
        calories: 350,
      },
      {
        day: "Wednesday",
        activity: "Cycling",
        duration: Math.min(userData.exerciseTime, 50),
        calories: 350,
      },
      {
        day: "Thursday",
        activity: "Swimming",
        duration: Math.min(userData.exerciseTime, 40),
        calories: 400,
      },
      {
        day: "Friday",
        activity: "Yoga & Stretching",
        duration: Math.min(userData.exerciseTime, 30),
        calories: 150,
      },
      {
        day: "Saturday",
        activity: "HIIT Training",
        duration: Math.min(userData.exerciseTime, 30),
        calories: 400,
      },
      {
        day: "Sunday",
        activity: "Walking/Light Cardio",
        duration: Math.min(userData.exerciseTime, 45),
        calories: 250,
      },
    ],
    nutrition: {
      dailyCalories: 2000,
      protein: 30,
      carbs: 45,
      fat: 25,
    },
    weightProgress: [
      { week: 0, weight: userData.weight },
      { week: 4, weight: userData.weight - 2 },
      { week: 8, weight: userData.weight - 4 },
      { week: 12, weight: userData.weight - 6 },
    ],
    bodyComposition: {
      muscle: 35,
      fat: 30,
      water: 30,
      bone: 5,
    },
    activityBreakdown: {
      cardio: 50,
      strength: 25,
      flexibility: 15,
      rest: 10,
    },
    timeline: {
      weeksToGoal,
      weeklyWeightLoss: "0.5kg",
    },
  };

  return NextResponse.json({ plan });
}
