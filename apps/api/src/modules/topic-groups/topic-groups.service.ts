import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { TopicGroupsRepository } from "./topic-groups.repository";
import { CreateTopicGroupDto, IeltsPartValue } from "./dto/create-topic-group.dto";

@Injectable()
export class TopicGroupsService {
  constructor(private readonly topicGroupsRepository: TopicGroupsRepository) {}

  findAll(part?: IeltsPartValue) {
    return this.topicGroupsRepository.findAll(part);
  }

  async findById(id: bigint) {
    const topicGroup = await this.topicGroupsRepository.findByIdWithQuestions(id);
    if (!topicGroup) throw new NotFoundException("Topic group not found");
    return topicGroup;
  }

  async create(dto: CreateTopicGroupDto) {
    try {
      return await this.topicGroupsRepository.create(dto);
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        throw new ConflictException("A topic group with this part and slug already exists");
      }
      throw error;
    }
  }
}
