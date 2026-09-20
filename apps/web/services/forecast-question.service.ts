import type { AttemptReportReason, ForecastQuestionPractice } from "@/types/forecast-question";
import { apiFetch } from "@/lib/api-client";

interface CreatedRecord {
  id: string;
}

export const forecastQuestionService = {
  /** `idOrSlug` = numeric question id or the slug used in the page URL. */
  getPractice(idOrSlug: string) {
    return apiFetch<ForecastQuestionPractice>(`/questions/${encodeURIComponent(idOrSlug)}/practice`);
  },

  setBookmark(questionId: string, isBookmarked: boolean) {
    return apiFetch<unknown>(`/questions/${questionId}/bookmark`, { method: isBookmarked ? "PUT" : "DELETE" });
  },

  reportAttempt(attemptId: string, payload: { reason: AttemptReportReason; note?: string }) {
    return apiFetch<unknown>(`/attempts/${attemptId}/reports`, { method: "POST", body: JSON.stringify(payload) });
  },

  /** "Ghi âm lại câu này": upload the take, open a single-question session and submit it for scoring. */
  async submitRecording(params: { questionId: string; part: string; audio: Blob; durationMs: number }) {
    const form = new FormData();
    form.append("file", params.audio, "answer.webm");
    const { url } = await apiFetch<{ url: string }>("/audio/upload", { method: "POST", body: form });

    const session = await apiFetch<CreatedRecord>("/practice-sessions", {
      method: "POST",
      body: JSON.stringify({ mode: "practice_question", part: params.part }),
    });
    return apiFetch<CreatedRecord>(`/practice-sessions/${session.id}/attempts`, {
      method: "POST",
      body: JSON.stringify({ questionId: params.questionId, audioUrl: url, durationMs: params.durationMs }),
    });
  },
};
