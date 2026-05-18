import apiClient from "../utils/api.utils";
import { ApiResponse } from "../types/api.types";
import { QuizAnswers, UserPreferences } from "../types/onboarding.types";

export async function submitOnboardingApi(
  data: QuizAnswers,
): Promise<UserPreferences> {
  const res = await apiClient.post<ApiResponse<UserPreferences>>(
    "/onboarding",
    data,
  );
  return res.data.data!;
}

export async function getOnboardingApi(): Promise<UserPreferences | null> {
  const res = await apiClient.get<ApiResponse<UserPreferences>>("/onboarding");
  return res.data.data ?? null;
}
