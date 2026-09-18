import type { TestHistoryData } from "@/types/test-history";
import { getTestHistoryMockData } from "@/lib/test-history-mock";

export const testHistoryService = {
  async getHistory(): Promise<TestHistoryData> {
    return getTestHistoryMockData();
  },
};
