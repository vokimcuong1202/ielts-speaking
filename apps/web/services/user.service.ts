import type { CurrentUser } from "@/types/user";
import { getCurrentUserMockData } from "@/lib/user-mock";

export const userService = {
  async getCurrentUser(): Promise<CurrentUser> {
    return getCurrentUserMockData();
  },
};
