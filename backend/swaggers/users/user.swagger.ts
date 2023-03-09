import { HttpExceptionOutput } from "src/common/dtos/http-exception.output.dto";
import { CreateUserOutput } from "../../src/users/dtos/create-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { HttpStatus } from "@nestjs/common";
import {
  USER_BAD_REQUEST_RESPONSE,
  USER_CONFLICT_RESPONSE,
  USER_NOT_FOUND_RESPONSE,
  USER_UNPROCESSABLE_ENTITY,
} from "src/users/constants/user.constants";
import { UpdateUserOutput } from "../../src/users/dtos/update-user.dto";

export class UserApiCreatedResponse extends CreateUserOutput {}

export class UserApiConflictResponse extends HttpExceptionOutput {
  @ApiProperty({
    example: HttpStatus.CONFLICT,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: { message: USER_CONFLICT_RESPONSE },
    description: "Error message from http execption filter",
    required: true,
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}

export class UserApiOkResponse extends UpdateUserOutput {
  @ApiProperty({
    example: HttpStatus.OK,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;
}

export class UserNotFoundResponse extends HttpExceptionOutput {
  @ApiProperty({
    example: HttpStatus.NOT_FOUND,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: { message: USER_NOT_FOUND_RESPONSE },
    description: "Error message from http execption filter",
    required: true,
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}

export class UserUnprocessableEntity extends HttpExceptionOutput {
  @ApiProperty({
    example: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: { message: USER_UNPROCESSABLE_ENTITY },
    description: USER_UNPROCESSABLE_ENTITY,
    required: true,
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}

export class UserBadRequestResponse extends HttpExceptionOutput {
  @ApiProperty({
    example: HttpStatus.BAD_REQUEST,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: { message: USER_BAD_REQUEST_RESPONSE },
    description: USER_BAD_REQUEST_RESPONSE,
    required: true,
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}
