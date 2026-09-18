import type { ForecastPracticeData } from "@/types/forecast";
import { getForecastPracticeMockData } from "@/lib/forecast-mock";

export const forecastService = {
  async getPracticeData(): Promise<ForecastPracticeData> {
    return getForecastPracticeMockData();
  },
};
