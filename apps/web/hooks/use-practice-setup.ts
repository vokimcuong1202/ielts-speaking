import { useQuery } from "@tanstack/react-query";
import { practiceSetupService } from "@/services/practice-setup.service";
import type { PracticePartId } from "@/types/practice-setup";

export function usePracticeSetup(partId: PracticePartId) {
  return useQuery({
    queryKey: ["practice-setup", partId],
    queryFn: () => practiceSetupService.getSetupConfig(partId),
  });
}
