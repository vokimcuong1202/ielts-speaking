import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardHome() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["dashboard", "home", accessToken],
    enabled: !!accessToken,
    retry: false,
    queryFn: dashboardService.getHome,
  });
}
