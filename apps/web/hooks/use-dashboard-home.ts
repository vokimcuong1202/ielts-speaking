import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export function useDashboardHome() {
  return useQuery({
    queryKey: ["dashboard", "home"],
    queryFn: dashboardService.getHome,
  });
}
