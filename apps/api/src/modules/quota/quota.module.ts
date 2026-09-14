import { Module } from "@nestjs/common";
import { QuotaController } from "./quota.controller";
import { QuotaService } from "./quota.service";
import { QuotaRepository } from "./quota.repository";

@Module({
  controllers: [QuotaController],
  providers: [QuotaService, QuotaRepository],
  exports: [QuotaService],
})
export class QuotaModule {}
