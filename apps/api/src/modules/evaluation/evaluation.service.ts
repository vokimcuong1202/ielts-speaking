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

  async evaluateAttempt(attemptId: bigint, transcript: string, questionText: string) {
    const errorTypes = await this.attemptsRepository.findErrorTypeSlugs();
    const { result, usageTokens } = await this.provider.evaluate(
      transcript,
      questionText,
      errorTypes.map((type) => type.slug),
    );
    const attempt = await this.attemptsRepository.saveEvaluation(attemptId, result);
    return { attempt, result, usageTokens };
  }
}
