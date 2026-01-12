import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const medicalDataService = {
  /**
   * Get medical conditions/history list
   * Supports search filtering
   */
  async getMedicalConditions(search?: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/medical-data/conditions`,
        {
          params: { search },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch medical conditions:", error);
      return [];
    }
  },

  /**
   * Get allergies list
   * Supports search filtering
   */
  async getAllergies(search?: string): Promise<string[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/medical-data/allergies`,
        {
          params: { search },
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch allergies:", error);
      return [];
    }
  },

  /**
   * Validate if allergen exists in known list
   */
  async validateAllergy(allergen: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/medical-data/validate-allergy`,
        { allergen }
      );
      return response.data.isValid || false;
    } catch (error) {
      console.error("Failed to validate allergy:", error);
      return false;
    }
  },

  /**
   * Validate if medical condition exists in known list
   */
  async validateCondition(condition: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/medical-data/validate-condition`,
        { condition }
      );
      return response.data.isValid || false;
    } catch (error) {
      console.error("Failed to validate condition:", error);
      return false;
    }
  },
};
