import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

@Injectable()
export class S3Storage {
  private readonly client = new S3Client({
    endpoint: process.env.STORAGE_ENDPOINT,
    region: process.env.STORAGE_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY ?? "",
      secretAccessKey: process.env.STORAGE_SECRET_KEY ?? "",
    },
  });

  private readonly bucket = process.env.STORAGE_BUCKET ?? "speaking-audio";

  async upload(buffer: Buffer, contentType: string): Promise<string> {
    const key = `sessions/${randomUUID()}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );

    return `${process.env.STORAGE_ENDPOINT}/${this.bucket}/${key}`;
  }
}
