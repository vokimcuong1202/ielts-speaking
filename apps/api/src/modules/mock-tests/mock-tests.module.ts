import { Module } from "@nestjs/common";
import { MockTestsController } from "./mock-tests.controller";
import { MockTestsService } from "./mock-tests.service";
import { MockTestsRepository } from "./mock-tests.repository";
import { QuotaModule } from "../quota/quota.module";

@Module({
  imports: [QuotaModule],
  controllers: [MockTestsController],
  providers: [MockTestsService, MockTestsRepository],
  exports: [MockTestsService],
})
export class MockTestsModule {}
