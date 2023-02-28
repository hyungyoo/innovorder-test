import { HttpStatus } from "@nestjs/common";
import { CreateUserInput, CreateUserOutput } from "./create-user.dto";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

/**
 * 유저 업그레이드에 사용될 dto
 */
export class UpdateUserInput extends PartialType(CreateUserInput) {}
/**
 * 유저 업그레이드 서비스의 리턴값 dto
 */
export class UpdateUserOutput extends CreateUserOutput {}
