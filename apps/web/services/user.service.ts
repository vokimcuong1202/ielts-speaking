import type { CurrentUser, SidebarProgress } from "@/types/user";
import { apiFetch } from "@/lib/api-client";

interface UserMeResponse {
  displayName: string;
}

export const userService = {
  async getCurrentUser(): Promise<CurrentUser> {
    const [me, sidebarProgress] = await Promise.all([
      apiFetch<UserMeResponse>("/users/me"),
      apiFetch<SidebarProgress>("/progress/sidebar"),
    ]);
    return { name: me.displayName, sidebarProgress };
  },
};
