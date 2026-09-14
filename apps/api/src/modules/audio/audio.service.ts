import { Injectable } from "@nestjs/common";
import { S3Storage } from "./storage/s3.storage";

@Injectable()
export class AudioService {
  constructor(private readonly storage: S3Storage) {}

  uploadAudio(file: Express.Multer.File) {
    return this.storage.upload(file.buffer, file.mimetype);
  }
}
