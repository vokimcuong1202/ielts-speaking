import type { DashboardHomeData } from "@/types/dashboard";
import { apiFetch } from "@/lib/api-client";

export const dashboardService = {
  getHome() {
    return apiFetch<DashboardHomeData>("/dashboard/home");
  },
};
