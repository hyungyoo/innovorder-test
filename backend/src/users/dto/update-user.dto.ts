import { HttpStatus } from "@nestjs/common";
import { CreateUserInput, CreateUserOutput } from "./create-user.dto";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";

/**
 * 유저 업그레이드에 사용될 dto
 */
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @ApiProperty({
    example: "hyungyoo@innovorder.fr",
    description:
      "The user-entered user email should be in the correct email format and must be unique",
    nullable: true,
  })
  @IsEmail()
  email?: string;
  @ApiProperty({
    example: "hyungjun",
    description: "The user's first name",
    nullable: true,
  })
  @IsString()
  firstName?: string;
  @ApiProperty({
    example: "yoo",
    description: "The user's last name",
    nullable: true,
  })
  @IsString()
  lastName?: string;
  @ApiProperty({
    example: "12345",
    description: "The user's password (must be at least 8 characters long)",
    nullable: true,
  })
  @IsString()
  @Length(8)
  password?: string;
}
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
