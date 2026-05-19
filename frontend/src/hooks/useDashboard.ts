import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { DashboardData } from "../types/dashboard.types";
import { fetchDashboardApi } from "../services/dashboard.service";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetchDashboardApi()
      .then(setData)
      .catch((err) => {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Failed to load dashboard"
            : "An unexpected error occurred",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refetch: load };
}
