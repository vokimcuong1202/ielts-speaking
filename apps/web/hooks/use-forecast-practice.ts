import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { forecastService } from "@/services/forecast.service";

export function useForecastPractice() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["forecast-practice", accessToken],
    enabled: !!accessToken,
    retry: false,
    queryFn: forecastService.getPracticeData,
  });
}
