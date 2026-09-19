import type { CurrentUser } from "@/types/user";

export function getCurrentUserMockData(): CurrentUser {
  return {
    name: "",
    sidebarProgress: { completed: 15, total: 25 },
  };
}
