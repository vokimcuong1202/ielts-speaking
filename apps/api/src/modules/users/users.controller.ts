import { Body, Controller, Get, Patch, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  me(@CurrentUser() user: { userId: string }) {
    return this.usersService.findById(user.userId);
  }

  @Patch("me")
  updateProfile(@CurrentUser() user: { userId: string }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  @Put("me/goal")
  updateGoal(@CurrentUser() user: { userId: string }, @Body() dto: UpdateGoalDto) {
    return this.usersService.updateGoal(user.userId, dto);
  }
}
