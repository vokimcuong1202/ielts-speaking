import { Module } from "@nestjs/common";
import { TopicGroupsController } from "./topic-groups.controller";
import { TopicGroupsService } from "./topic-groups.service";
import { TopicGroupsRepository } from "./topic-groups.repository";

@Module({
  controllers: [TopicGroupsController],
  providers: [TopicGroupsService, TopicGroupsRepository],
  exports: [TopicGroupsService],
})
export class TopicGroupsModule {}
