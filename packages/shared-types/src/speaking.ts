export type SessionStatus = "PENDING" | "UPLOADED" | "TRANSCRIBING" | "EVALUATING" | "COMPLETED" | "FAILED";

export interface PracticeSession {
  id: string;
  exerciseId: string;
  status: SessionStatus;
  audioUrl?: string;
  durationSeconds?: number;
  createdAt: string;
}
