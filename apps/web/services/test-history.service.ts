import type { TestHistoryData, TestType } from "@/types/test-history";
import { apiFetch } from "@/lib/api-client";

export interface TestHistoryParams {
  type?: TestType;
  limit?: number;
}

export const testHistoryService = {
  getHistory({ type, limit }: TestHistoryParams = {}) {
    const query = new URLSearchParams();
    if (type) query.set("type", type);
    if (limit) query.set("limit", String(limit));
    const suffix = query.size ? `?${query}` : "";
    return apiFetch<TestHistoryData>(`/mock-tests/history${suffix}`);
  },
};
