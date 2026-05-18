export interface OnboardingData {
  favoriteAssets: string[];
  customAsset?: string;
  investorType: string;
  experienceLevel: string;
  riskTolerance: string;
  investmentGoal: string;
}

export interface UserPreferences extends OnboardingData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
