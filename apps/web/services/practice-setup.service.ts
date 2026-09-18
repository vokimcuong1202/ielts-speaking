import type { PracticePartId, PracticeSetupConfig } from "@/types/practice-setup";
import { getPracticeSetupMockData } from "@/lib/practice-setup-mock";

export const practiceSetupService = {
  async getSetupConfig(partId: PracticePartId): Promise<PracticeSetupConfig> {
    return getPracticeSetupMockData(partId);
  },
};
