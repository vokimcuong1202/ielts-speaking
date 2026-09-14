import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { QuotaService } from "./quota.service";

@Controller("quota")
@UseGuards(JwtAuthGuard)
export class QuotaController {
  constructor(private readonly quotaService: QuotaService) {}

  @Get("me")
  getMyQuota(@CurrentUser() user: { userId: string }) {
    return this.quotaService.getSummary(user.userId);
  }
}
