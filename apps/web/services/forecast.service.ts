import type { ForecastPracticeData } from "@/types/forecast";
import { apiFetch } from "@/lib/api-client";

export const forecastService = {
  getPracticeData() {
    return apiFetch<ForecastPracticeData>("/forecast-sets/current/practice");
  },
};
