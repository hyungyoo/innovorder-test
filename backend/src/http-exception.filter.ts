import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | { message: any; statusCode: number }
      | {
          statusCode: HttpStatus.BAD_REQUEST;
          message: string[];
        }; // class-validator 타이핑

    if (
      typeof error !== "string" &&
      error.statusCode === HttpStatus.BAD_REQUEST
    ) {
      // class-validator 에러
      return response.status(status).json({
        success: false,
        code: status,
        data: error.message,
      });
    }

    response.status(status).json({
      success: false,
      code: status,
      data: error.message,
    });
  }
}
