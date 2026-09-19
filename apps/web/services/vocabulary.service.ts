import type { VocabularyNotebookData, VocabularyNotebookStatus } from "@/types/vocabulary";
import { apiFetch } from "@/lib/api-client";

export interface VocabularyNotebookParams {
  status?: VocabularyNotebookStatus;
  groupLimit?: number;
}

export const vocabularyService = {
  getNotebook({ status, groupLimit }: VocabularyNotebookParams = {}) {
    const query = new URLSearchParams();
    if (status && status !== "all") query.set("status", status);
    if (groupLimit) query.set("groupLimit", String(groupLimit));
    const suffix = query.size ? `?${query}` : "";
    return apiFetch<VocabularyNotebookData>(`/vocabulary/overview${suffix}`);
  },
};
