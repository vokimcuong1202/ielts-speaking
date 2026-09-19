import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";
import { ValidateBy, buildMessage } from "class-validator";

// bigserial ids are exposed as strings in JSON; accept "12" or 12 and hand the service a bigint.
export function BigIntId() {
  return applyDecorators(
    Transform(({ value }) =>
      (typeof value === "string" || typeof value === "number") && /^\d+$/.test(String(value)) ? BigInt(value) : value,
    ),
    ValidateBy(
      {
        name: "isBigIntId",
        validator: { validate: (value) => typeof value === "bigint" && value > 0n },
        constraints: [],
      },
      { message: buildMessage((eachPrefix) => `${eachPrefix}$property must be a positive integer id`) },
    ),
  );
}
