export interface QuizAnswers {
  favoriteAssets: string[];
  customAsset: string;
  investorType: string;
  experienceLevel: string;
  riskTolerance: string;
  investmentGoal: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  favoriteAssets: string[];
  customAsset?: string;
  investorType: string;
  experienceLevel: string;
  riskTolerance: string;
  investmentGoal: string;
  createdAt: string;
  updatedAt: string;
}
