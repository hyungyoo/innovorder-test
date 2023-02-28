import { IsBoolean, IsNumber, IsString } from "class-validator";
import { CoreOutput } from "./core-output.dto";
import { ApiProperty } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";

/**
 * DTO for HTTP Exception Filters,
 * returning either a string or a string array using Core Output
 */
export class HttpExceptionOutput extends CoreOutput {
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}

/**
 * ApiNotFoundResponse 데코레이터에 사용될 타입
 */
export class NotFoundResponseSwagger extends HttpExceptionOutput {
  @ApiProperty({
    example: HttpStatus.NOT_FOUND,
    description: "코드값",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: {
      message: "찾지 못했습니다",
    },
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}

/**
 * ApiNotFoundResponse 데코레이터에 사용될 타입
 */
export class ConflictResponseSwagger extends HttpExceptionOutput {
  @ApiProperty({
    example: HttpStatus.CONFLICT,
    description: "코드값",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: {
      message: "That email already exists for a user",
    },
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}
