import { Module } from "@nestjs/common";
import { VocabularyController } from "./vocabulary.controller";
import { VocabularyService } from "./vocabulary.service";
import { VocabularyOverviewService } from "./vocabulary-overview.service";
import { VocabularyTopicDetailService } from "./vocabulary-topic-detail.service";
import { VocabularyRepository } from "./vocabulary.repository";

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularyOverviewService, VocabularyTopicDetailService, VocabularyRepository],
  exports: [VocabularyService],
})
export class VocabularyModule {}
