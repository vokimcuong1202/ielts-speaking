import { Module } from "@nestjs/common";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { QuestionPracticeService } from "./question-practice.service";
import { QuestionsRepository } from "./questions.repository";
import { QuotaModule } from "../quota/quota.module";

@Module({
  imports: [QuotaModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionPracticeService, QuestionsRepository],
  exports: [QuestionsService],
})
export class QuestionsModule {}
