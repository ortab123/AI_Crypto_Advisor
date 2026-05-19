export interface QuizAnswers {
  favoriteAssets: string[];
  customAsset: string;
  investorType: string;
  experienceLevel: string;
  riskTolerance: string;
  investmentGoal: string;
  preferredContent: string[];
}

export interface UserPreferences {
  id: string;
  userId: string;
  favoriteAssets: string[];
  customAsset?: string | null;
  investorType: string;
  experienceLevel: string;
  riskTolerance: string;
  investmentGoal: string;
  preferredContent: string[];
  createdAt: string;
  updatedAt: string;
}
