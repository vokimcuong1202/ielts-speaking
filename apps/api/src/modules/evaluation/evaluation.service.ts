import { Inject, Injectable } from "@nestjs/common";
import { AttemptsRepository } from "../practice-sessions/attempts.repository";
import { EVALUATION_PROVIDER, EvaluationProvider } from "./evaluation.provider";

@Injectable()
export class EvaluationService {
  readonly providerName: string;

  constructor(
    @Inject(EVALUATION_PROVIDER) private readonly provider: EvaluationProvider,
    private readonly attemptsRepository: AttemptsRepository,
  ) {
    this.providerName = provider.name;
  }

  async evaluateAttempt(attemptId: string, transcript: string, questionText: string) {
    const { result, usageTokens } = await this.provider.evaluate(transcript, questionText);
    await this.attemptsRepository.createScore(attemptId, result);
    await this.attemptsRepository.markCompleted(attemptId);
    return { result, usageTokens };
  }
}
