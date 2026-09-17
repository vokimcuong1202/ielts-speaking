import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { TopicGroupsService } from "./topic-groups.service";
import { CreateTopicGroupDto } from "./dto/create-topic-group.dto";

@Controller("topic-groups")
@UseGuards(JwtAuthGuard)
export class TopicGroupsController {
  constructor(private readonly topicGroupsService: TopicGroupsService) {}

  @Get()
  findAll() {
    return this.topicGroupsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.topicGroupsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTopicGroupDto) {
    return this.topicGroupsService.create(dto);
  }
}
