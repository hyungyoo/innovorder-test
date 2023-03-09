import { HttpStatus } from "@nestjs/common";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { LoginOutput } from "src/auth/dtos/login.dto";
import { AUTH_UNAUTHORIZED } from "src/auth/interfaces/auth.interface";
import { HttpExceptionOutput } from "src/common/dtos/http-exception.output.dto";
import { ACCESS_TOKEN_BLACKLISTED } from "src/redis/interfaces/redis.constants";

export class LoginApiOkResponse extends LoginOutput {
  @ApiProperty({
    example: HttpStatus.OK,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;
}

export class LogoutNoContentResponse extends PickType(LoginApiOkResponse, [
  "success",
]) {
  @ApiProperty({
    example: HttpStatus.NO_CONTENT,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;
}

export class RefreshApiOkResponse extends PickType(LoginApiOkResponse, [
  "success",
  "code",
]) {}

export class LoginAuthorizedResponse extends HttpExceptionOutput {
  @ApiProperty({
    example: HttpStatus.UNAUTHORIZED,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: { message: AUTH_UNAUTHORIZED },
    description: AUTH_UNAUTHORIZED,
    required: true,
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}

export class LogoutUnAuthorizedResponse extends LoginAuthorizedResponse {
  @ApiProperty({
    example: { message: ACCESS_TOKEN_BLACKLISTED },
    description: ACCESS_TOKEN_BLACKLISTED,
    required: true,
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}

export class RefreshUnAuthorizedResponse extends LogoutUnAuthorizedResponse {}
