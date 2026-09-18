import { useQuery } from "@tanstack/react-query";
import { testHistoryService } from "@/services/test-history.service";

export function useTestHistory() {
  return useQuery({
    queryKey: ["test-history"],
    queryFn: testHistoryService.getHistory,
  });
}
