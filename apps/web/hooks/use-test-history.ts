import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { testHistoryService, type TestHistoryParams } from "@/services/test-history.service";

export function useTestHistory(params: TestHistoryParams) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["test-history", params, accessToken],
    enabled: !!accessToken,
    retry: false,
    placeholderData: keepPreviousData,
    queryFn: () => testHistoryService.getHistory(params),
  });
}
