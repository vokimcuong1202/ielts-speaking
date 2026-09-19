import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { Prisma } from "../../../database/generated/client";
import { AppModule } from "./app.module";
import { httpLogger } from "./infrastructure/logging/http-logger";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

// bigserial ids and numeric() bands/ease values are not JSON-serializable by default.
// Ids go out as strings (safe for JS clients); Decimals are small enough to send as numbers.
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function (this: bigint) {
  return this.toString();
};
(Prisma.Decimal.prototype as unknown as { toJSON: () => number }).toJSON = function (this: Prisma.Decimal) {
  return this.toNumber();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(httpLogger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  const port = process.env.API_PORT ?? 4000;
  await app.listen(port);
}

bootstrap();
