export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface FeaturesResult {
  answer: string;
  isRelevant: boolean;
  features: Feature[];
}

export interface WeightLossData {
  name: string;
  age: number;
  weight: number;
  height: number;
  goalWeight: number;
  exerciseTime: number;
}

export interface WeightLossPlan {
  summary: string;
  bmi: number;
  bmiCategory: string;
  exerciseCalendar: {
    day: string;
    activity: string;
    duration: number;
    calories: number;
  }[];
  nutrition: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  timeline: { weeksToGoal: number; weeklyWeightLoss: number };
}

export interface ChatBoxProps {
  onClose?: () => void;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  weightLossData: WeightLossData | null;
}
