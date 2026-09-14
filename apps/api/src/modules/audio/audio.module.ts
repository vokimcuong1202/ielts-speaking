import { Module } from "@nestjs/common";
import { AudioController } from "./audio.controller";
import { AudioService } from "./audio.service";
import { S3Storage } from "./storage/s3.storage";

@Module({
  controllers: [AudioController],
  providers: [AudioService, S3Storage],
  exports: [AudioService],
})
export class AudioModule {}
