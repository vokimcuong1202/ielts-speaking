import type { CurrentUser } from "@/types/user";
import { apiFetch } from "@/lib/api-client";
import { getCurrentUserMockData } from "@/lib/user-mock";

interface UserMeResponse {
  displayName: string;
}

export const userService = {
  async getCurrentUser(): Promise<CurrentUser> {
    const me = await apiFetch<UserMeResponse>("/users/me");
    // No API for the sidebar progress widget yet, so it stays mocked.
    return { ...getCurrentUserMockData(), name: me.displayName };
  },
};
