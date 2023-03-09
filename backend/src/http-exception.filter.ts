import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { HttpExceptionOutput } from "./common/dtos/http-exception.output.dto";

/**
 * ExceptionFilter class that catches HttpExceptions
 * The catch method takes exception and host parameters
 * This class is for handling HTTP responses,
 * and separately implemented typing and return for errors of class validator.
 * @returns
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException,
    host: ArgumentsHost
  ): Response<HttpExceptionOutput> {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();

    const error = exception.getResponse();

    return response.status(status).json({
      success: false,
      code: error["status"] || error["statusCode"],
      error: { message: error["message"] },
    });
  }
}
