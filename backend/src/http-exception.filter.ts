import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Request, Response } from "express";
import { HttpExceptionOutput } from "./common/dtos/http-exception.output.dto";
import { AuthService } from "./auth/auth.service";

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
    const reqeust = context.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | { message: any; statusCode: number }
      | {
          statusCode: HttpStatus.BAD_REQUEST;
          message: string[];
        };

    console.log("*****************EXCEPTION FILTER*****************");

    if (
      typeof error !== "string" &&
      error.statusCode === HttpStatus.BAD_REQUEST
    ) {
      return response.status(status).json({
        success: false,
        code: status,
        error: { message: error.message },
      });
    }
    response.status(status).json({
      success: false,
      code: status,
      error: { message: error.message },
    });
  }
}
