/**
 * useDashboard Hook Tests
 * Topics: Dashboard Data Testing, Loading States Testing, Refresh / Persistence Testing
 */
import "@testing-library/jest-dom";
import { renderHook, waitFor, act } from "@testing-library/react";
import axios from "axios";
import { useDashboard } from "../hooks/useDashboard";

// Mock the service module — avoids import.meta.env at module load time
jest.mock("../services/dashboard.service", () => ({
  fetchDashboardApi: jest.fn(),
}));

import { fetchDashboardApi } from "../services/dashboard.service";
const mockFetch = jest.mocked(fetchDashboardApi);

const mockDashboardData = {
  profile: {
    favoriteAssets: ["Bitcoin (BTC)"],
    investorType: "Long-term investor",
    riskTolerance: "Medium",
    experienceLevel: "Intermediate",
    investmentGoal: "Wealth accumulation",
    preferredContent: [],
  },
  prices: [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      price: 50000,
      change24h: 2.5,
      sparkline: [],
    },
  ],
  news: [],
  insight: "Bitcoin looks strong.",
  insightId: "abc123def456",
  meme: null,
  userFeedback: {},
  trends: { trending: [], reddit: [], fearGreed: null },
};

describe("useDashboard", () => {
  test("starts with isLoading=true and null data", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useDashboard());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test("populates data and clears loading on successful fetch", async () => {
    mockFetch.mockResolvedValue(mockDashboardData as any);

    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockDashboardData);
    expect(result.current.error).toBeNull();
  });

  test("sets error message and clears loading on fetch failure", async () => {
    // Make axios.isAxiosError recognise our fake error object
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    mockFetch.mockRejectedValue({
      isAxiosError: true,
      response: { data: { message: "Unauthorized" } },
    });

    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Unauthorized");
    expect(result.current.data).toBeNull();
  });

  test("refetch triggers a second load and updates data", async () => {
    mockFetch.mockResolvedValueOnce(mockDashboardData as any);

    const { result } = renderHook(() => useDashboard());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const updatedData = { ...mockDashboardData, insight: "Updated insight." };
    mockFetch.mockResolvedValueOnce(updatedData as any);

    act(() => {
      result.current.refetch();
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.insight).toBe("Updated insight.");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
