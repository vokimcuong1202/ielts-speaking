import { Injectable } from "@nestjs/common";
import { TopicGroupsRepository } from "./topic-groups.repository";
import { CreateTopicGroupDto } from "./dto/create-topic-group.dto";

@Injectable()
export class TopicGroupsService {
  constructor(private readonly topicGroupsRepository: TopicGroupsRepository) {}

  findAll() {
    return this.topicGroupsRepository.findAllActive();
  }

  findById(id: string) {
    return this.topicGroupsRepository.findByIdWithQuestions(id);
  }

  create(dto: CreateTopicGroupDto) {
    return this.topicGroupsRepository.create(dto);
  }
}
