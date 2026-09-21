import type { AnswerSupport, PronunciationResult, Translation } from "@/types/answer-support";
import { apiFetch } from "@/lib/api-client";

const questionPath = (idOrSlug: string) => `/questions/${encodeURIComponent(idOrSlug)}`;

export const answerSupportService = {
  getSupport(idOrSlug: string) {
    return apiFetch<AnswerSupport>(`${questionPath(idOrSlug)}/support`);
  },

  saveNote(idOrSlug: string, body: string) {
    return apiFetch<{ body: string; updatedAt: string }>(`${questionPath(idOrSlug)}/note`, { method: "PUT", body: JSON.stringify({ body }) });
  },

  deleteNote(idOrSlug: string) {
    return apiFetch<void>(`${questionPath(idOrSlug)}/note`, { method: "DELETE" });
  },

  translate(text: string) {
    return apiFetch<Translation>("/translations", { method: "POST", body: JSON.stringify({ text }) });
  },

  checkPronunciation(audio: Blob, text: string) {
    const form = new FormData();
    form.append("file", audio, "pronunciation.webm");
    form.append("text", text);
    return apiFetch<PronunciationResult>("/pronunciation-checks", { method: "POST", body: form });
  },
};
