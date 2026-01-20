export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface WeightLossData {
  currentWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  weightLossData: WeightLossData | null;
}
