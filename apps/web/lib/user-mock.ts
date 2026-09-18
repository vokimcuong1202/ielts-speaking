import type { CurrentUser } from "@/types/user";

export function getCurrentUserMockData(): CurrentUser {
  return {
    name: "Minh Anh",
    sidebarProgress: { completed: 15, total: 25 },
  };
}
