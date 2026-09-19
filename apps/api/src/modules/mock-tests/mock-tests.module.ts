import { Module } from "@nestjs/common";
import { MockTestsController } from "./mock-tests.controller";
import { MockTestsService } from "./mock-tests.service";
import { MockTestsRepository } from "./mock-tests.repository";
import { MockTestHistoryService } from "./mock-test-history.service";
import { QuotaModule } from "../quota/quota.module";

@Module({
  imports: [QuotaModule],
  controllers: [MockTestsController],
  providers: [MockTestsService, MockTestHistoryService, MockTestsRepository],
  exports: [MockTestsService],
})
export class MockTestsModule {}
