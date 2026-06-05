import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * This is a global error handler for all http endpoint, with this we dont have to wrap every code with try catch, just throw errores whenever needed and this will catch them
 * Note: this only works for HTTP endpoints, MQTT must use try catch blocks
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(exception);

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        code: status,
        message:
          exception instanceof HttpException
            ? exception.message
            : 'Internal server error',
      },
      path: request.url,
    });
  }
}
