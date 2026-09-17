import type { DashboardHomeData } from "@/types/dashboard";
import { getDashboardMockData } from "@/lib/dashboard-mock";

export const dashboardService = {
  async getHome(): Promise<DashboardHomeData> {
    return getDashboardMockData();
  },
};
