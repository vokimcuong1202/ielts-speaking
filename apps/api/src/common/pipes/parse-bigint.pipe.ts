import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    if (!/^\d+$/.test(value)) {
      throw new BadRequestException("Validation failed (numeric id expected)");
    }
    return BigInt(value);
  }
}
