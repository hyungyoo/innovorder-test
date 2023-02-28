import { HttpStatus } from "@nestjs/common";
import { CreateUserInput, CreateUserOutput } from "./create-user.dto";
import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 유저 업그레이드에 사용될 dto
 */
export class UpdateUserInput extends CreateUserInput {}

/**
 * 유저 업그레이드 서비스의 리턴값 dto
 */
export class UpdateUserOutput extends CreateUserOutput {
  @ApiProperty({
    example: HttpStatus.OK,
    description: "코드값",
    required: true,
  })
  @IsNumber()
  code: number;
}
