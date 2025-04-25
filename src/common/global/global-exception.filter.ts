import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessages: string[] = ['Unknown error'];
    let errorTitle = 'Error';

    // Якщо це HttpException (наприклад, BadRequestException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Перевіряємо, чи є response об'єктом і чи містить message
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse &&
        'message' in exceptionResponse
      ) {
        const responseObj = exceptionResponse as { message: string | string[] };
        errorTitle = (exceptionResponse as any).error || 'Validation Error';

        // Якщо message - це масив (валідаційні помилки)
        if (Array.isArray(responseObj.message)) {
          errorMessages = responseObj.message;
        } else {
          // Якщо message - це рядок
          errorMessages = [responseObj.message];
        }
      } else {
        // Якщо response - це просто рядок
        errorMessages = [exceptionResponse as string];
      }
    } else if (exception instanceof Error) {
      // Для звичайних помилок
      errorMessages = [exception.message];
    }

    // Формуємо відповідь для клієнта
    response.status(status).json({
      statusCode: status,
      message: errorTitle,
      errors: errorMessages,
      timestamp: new Date().toISOString(),
    });
  }
}
