import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";
import type { Logger as PinoLoggerInstance } from "pino";
import { logger as fallbackLogger } from "../../infrastructure/logging/pino";

type RequestWithLog = Request & { id?: string; log?: PinoLoggerInstance };

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithLog>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const code = HttpStatus[status] ?? "INTERNAL_SERVER_ERROR";
    const message = this.extractMessage(exception, status);
    const requestId = request.id;

    const log = request.log ?? fallbackLogger;
    const logPayload = { requestId, method: request.method, url: request.url, statusCode: status };

    if (status >= 500) {
      log.error({ ...logPayload, err: exception }, "Unhandled exception");
    } else {
      log.warn(logPayload, "Request error");
    }

    response.status(status).json({
      error: { code, message, requestId },
    });
  }

  private extractMessage(exception: unknown, status: number): string | string[] {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === "string") return body;
      if (typeof body === "object" && body !== null && "message" in body) {
        return (body as { message: string | string[] }).message;
      }
      return exception.message;
    }

    return status === HttpStatus.INTERNAL_SERVER_ERROR ? "Internal server error" : "Unexpected error";
  }
}
