import { Module } from "@nestjs/common";
import { EvaluationService } from "./evaluation.service";
import { EVALUATION_PROVIDER } from "./evaluation.provider";
import { OpenAiProvider } from "./providers/openai/openai.provider";
import { MockEvaluationProvider } from "./providers/mock/mock.provider";
import { PracticeSessionsModule } from "../practice-sessions/practice-sessions.module";

const SelectedProvider = process.env.EVALUATION_PROVIDER === "mock" ? MockEvaluationProvider : OpenAiProvider;

@Module({
  imports: [PracticeSessionsModule],
  providers: [
    EvaluationService,
    SelectedProvider,
    { provide: EVALUATION_PROVIDER, useExisting: SelectedProvider },
  ],
  exports: [EvaluationService],
})
export class EvaluationModule {}
