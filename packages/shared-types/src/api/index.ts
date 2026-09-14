import { PracticeSession } from "../speaking";
import { EvaluationResult } from "../evaluation";
import { Exercise } from "../exercise";

export interface CreateSessionRequest {
  exerciseId: string;
  audioUrl: string;
  durationSeconds: number;
}

export interface SessionResultResponse extends PracticeSession {
  exercise: Exercise;
  transcript?: string;
  evaluation?: EvaluationResult;
}
