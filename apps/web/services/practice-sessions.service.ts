import type { CreateSessionRequest, SessionResultResponse, PracticeSession } from "@repo/shared-types";
import { apiFetch } from "../lib/api-client";

export const practiceSessionsService = {
  create(payload: CreateSessionRequest) {
    return apiFetch<PracticeSession>("/practice-sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getResult(sessionId: string) {
    return apiFetch<SessionResultResponse>(`/practice-sessions/${sessionId}`);
  },

  getHistory() {
    return apiFetch<PracticeSession[]>("/practice-sessions/history");
  },
};
