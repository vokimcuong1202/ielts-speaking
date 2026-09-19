import { Module } from "@nestjs/common";
import { VocabularyController } from "./vocabulary.controller";
import { VocabularyService } from "./vocabulary.service";
import { VocabularyRepository } from "./vocabulary.repository";

@Module({
  controllers: [VocabularyController],
  providers: [VocabularyService, VocabularyRepository],
  exports: [VocabularyService],
})
export class VocabularyModule {}
