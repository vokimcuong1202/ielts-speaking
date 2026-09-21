import { Module } from "@nestjs/common";
import { AnswerToolsController, QuestionSupportController } from "./answer-support.controller";
import { AnswerSupportService } from "./answer-support.service";
import { AnswerSupportRepository } from "./answer-support.repository";
import { TRANSLATION_PROVIDER } from "./translation.provider";
import { PRONUNCIATION_PROVIDER } from "./pronunciation.provider";
import { MockTranslationProvider } from "./providers/mock/mock-translation.provider";
import { MockPronunciationProvider } from "./providers/mock/mock-pronunciation.provider";

@Module({
  controllers: [QuestionSupportController, AnswerToolsController],
  // TODO(later): choose real providers by env (like EVALUATION_PROVIDER) once translation / pronunciation services exist.
  providers: [
    AnswerSupportService,
    AnswerSupportRepository,
    MockTranslationProvider,
    MockPronunciationProvider,
    { provide: TRANSLATION_PROVIDER, useExisting: MockTranslationProvider },
    { provide: PRONUNCIATION_PROVIDER, useExisting: MockPronunciationProvider },
  ],
})
export class AnswerSupportModule {}
