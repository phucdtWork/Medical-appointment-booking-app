/**
 * Medical Data Service
 * Provides medical history conditions and allergies data from various sources
 * Uses static lists + optional API calls to OpenFDA, RxNorm, etc.
 */

// Common medical conditions/history list (ICD-10 based)
const MEDICAL_CONDITIONS = [
  "Hypertension (High Blood Pressure)",
  "Diabetes Type 2",
  "Diabetes Type 1",
  "Asthma",
  "COPD",
  "Heart Disease",
  "Cardiac Arrhythmia",
  "Hypercholesterolemia",
  "Obesity",
  "Thyroid Disease",
  "Depression",
  "Anxiety Disorder",
  "PTSD",
  "Bipolar Disorder",
  "Arthritis",
  "Osteoporosis",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
  "Migraine",
  "Epilepsy",
  "Stroke History",
  "Autoimmune Disease",
  "Lupus",
  "Crohn's Disease",
  "Ulcerative Colitis",
  "Celiac Disease",
  "IBS",
  "Gerd",
  "Ulcer",
  "Sleep Apnea",
  "Anemia",
  "HIV",
  "Hepatitis B",
  "Hepatitis C",
  "Tuberculosis",
  "Pneumonia",
  "Sinusitis",
  "Glaucoma",
  "Cataracts",
  "Hearing Loss",
];

// Common allergies list
const COMMON_ALLERGIES = [
  "Penicillin",
  "Amoxicillin",
  "Cephalosporin",
  "Sulfonamide",
  "Fluoroquinolone",
  "Macrolide",
  "Aspirin",
  "NSAIDs",
  "Ibuprofen",
  "Naproxen",
  "Acetaminophen",
  "Codeine",
  "Morphine",
  "Barbiturates",
  "Local Anesthetics",
  "Contrast Media",
  "Latex",
  "Chlorhexidine",
  "Vancomycin",
  "Insulin",
  "Pollen",
  "Dust Mite",
  "Mold",
  "Animal Dander",
  "Peanuts",
  "Tree Nuts",
  "Fish",
  "Shellfish",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat",
  "Sesame",
  "Corn",
  "Latex",
];

export class MedicalDataService {
  /**
   * Get list of common medical conditions/history
   * Can be enhanced with OpenFDA API or SNOMED CT in future
   */
  static getMedicalConditions(searchQuery?: string): string[] {
    if (!searchQuery) {
      return MEDICAL_CONDITIONS;
    }

    const q = searchQuery.toLowerCase();
    return MEDICAL_CONDITIONS.filter((condition) =>
      condition.toLowerCase().includes(q)
    );
  }

  /**
   * Get list of common allergies
   * Can be enhanced with FDA allergen database in future
   */
  static getAllergies(searchQuery?: string): string[] {
    if (!searchQuery) {
      return COMMON_ALLERGIES;
    }

    const q = searchQuery.toLowerCase();
    return COMMON_ALLERGIES.filter((allergy) =>
      allergy.toLowerCase().includes(q)
    );
  }

  /**
   * Optional: Fetch from OpenFDA API for allergens
   * Free API, no authentication required
   * https://open.fda.gov/apis/drug/ndc/
   */
  static async fetchFromOpenFDA(query: string): Promise<string[]> {
    try {
      const response = await fetch(
        `https://api.fda.gov/drug/ndc.json?search=allergen:"${query}"&limit=10`
      );
      if (!response.ok) throw new Error("OpenFDA API error");
      const data = (await response.json()) as any;

      if (data.results && Array.isArray(data.results)) {
        return data.results.map((item: any) => item.brand_name || "Unknown");
      }
      return [];
    } catch (error) {
      console.warn("OpenFDA fetch failed:", error);
      return [];
    }
  }

  /**
   * Optional: Validate allergy against known allergens
   */
  static validateAllergy(allergen: string): boolean {
    return COMMON_ALLERGIES.some(
      (a) => a.toLowerCase() === allergen.toLowerCase()
    );
  }

  /**
   * Optional: Validate medical condition
   */
  static validateMedicalCondition(condition: string): boolean {
    return MEDICAL_CONDITIONS.some(
      (c) => c.toLowerCase() === condition.toLowerCase()
    );
  }
}
