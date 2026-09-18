import type { VocabularyNotebookData } from "@/types/vocabulary";
import { getVocabularyNotebookMockData } from "@/lib/vocabulary-mock";

export const vocabularyService = {
  async getNotebook(): Promise<VocabularyNotebookData> {
    return getVocabularyNotebookMockData();
  },
};
