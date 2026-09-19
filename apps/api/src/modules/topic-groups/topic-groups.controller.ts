import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { IsIn, IsOptional } from "class-validator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ParseBigIntPipe } from "../../common/pipes/parse-bigint.pipe";
import { TopicGroupsService } from "./topic-groups.service";
import { CreateTopicGroupDto, IELTS_PARTS, IeltsPartValue } from "./dto/create-topic-group.dto";

class ListTopicGroupsQuery {
  @IsOptional()
  @IsIn(IELTS_PARTS)
  part?: IeltsPartValue;
}

@Controller("topic-groups")
@UseGuards(JwtAuthGuard)
export class TopicGroupsController {
  constructor(private readonly topicGroupsService: TopicGroupsService) {}

  @Get()
  findAll(@Query() query: ListTopicGroupsQuery) {
    return this.topicGroupsService.findAll(query.part);
  }

  @Get(":id")
  findOne(@Param("id", ParseBigIntPipe) id: bigint) {
    return this.topicGroupsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTopicGroupDto) {
    return this.topicGroupsService.create(dto);
  }
}
