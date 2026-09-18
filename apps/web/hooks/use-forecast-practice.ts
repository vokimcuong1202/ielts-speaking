import { useQuery } from "@tanstack/react-query";
import { forecastService } from "@/services/forecast.service";

export function useForecastPractice() {
  return useQuery({
    queryKey: ["forecast-practice"],
    queryFn: forecastService.getPracticeData,
  });
}
