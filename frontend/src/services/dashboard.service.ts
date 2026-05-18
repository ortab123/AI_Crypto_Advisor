import apiClient from "../utils/api.utils";
import { ApiResponse } from "../types/api.types";
import { DashboardData } from "../types/dashboard.types";

export async function fetchDashboardApi(): Promise<DashboardData> {
  const res = await apiClient.get<ApiResponse<DashboardData>>("/dashboard");
  return res.data.data!;
}

export async function submitFeedbackApi(
  contentType: string,
  contentId: string,
  value: string | null,
): Promise<void> {
  await apiClient.post<ApiResponse<null>>("/feedback", {
    contentType,
    contentId,
    value,
  });
}
