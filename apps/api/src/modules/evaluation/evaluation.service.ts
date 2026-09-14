import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { EVALUATION_PROVIDER, EvaluationProvider } from "./evaluation.provider";

@Injectable()
export class EvaluationService {
  constructor(
    @Inject(EVALUATION_PROVIDER) private readonly provider: EvaluationProvider,
    private readonly prisma: PrismaService,
  ) {}

  async evaluateSession(sessionId: string, transcript: string, exercisePrompt: string) {
    const result = await this.provider.evaluate(transcript, exercisePrompt);

    await this.prisma.evaluation.create({
      data: { sessionId, ...result },
    });

    return result;
  }
}
