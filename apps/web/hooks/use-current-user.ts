import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: userService.getCurrentUser,
    staleTime: 0,
  });
}
