import { apiFetch } from "@/lib/api-client";

interface NotebookEntry {
  id: string;
  vocabItemId: string;
}

// "Lưu để học sau": words land in the Sổ từ vựng notebook and enter its spaced-repetition queue.
export const savedVocabularyService = {
  save(vocabItemId: string, sourceQuestionId: string) {
    return apiFetch<NotebookEntry>("/vocabulary/notebook", {
      method: "POST",
      body: JSON.stringify({ vocabItemId, source: "question_panel", sourceQuestionId }),
    });
  },

  saveMany(vocabItemIds: string[], sourceQuestionId: string) {
    return apiFetch<NotebookEntry[]>("/vocabulary/notebook/bulk", {
      method: "POST",
      body: JSON.stringify({ vocabItemIds, source: "question_panel", sourceQuestionId }),
    });
  },

  /** A phrase the learner selected themselves, with the meaning they confirmed. */
  saveCustom(term: string, meaningVi: string, sourceQuestionId: string) {
    return apiFetch<NotebookEntry>("/vocabulary/notebook/custom", {
      method: "POST",
      body: JSON.stringify({ term, meaningVi, sourceQuestionId }),
    });
  },

  remove(userVocabId: string) {
    return apiFetch<void>(`/vocabulary/notebook/${userVocabId}`, { method: "DELETE" });
  },
};
