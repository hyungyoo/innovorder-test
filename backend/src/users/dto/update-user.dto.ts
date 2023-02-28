import { PartialType } from "@nestjs/swagger";
import { CreateUserInput, CreateUserOutput } from "./create-user.dto";

/**
 * 유저 업그레이드에 사용될 dto
 */
export class UpdateUserInput extends PartialType(CreateUserInput) {}

/**
 * 유저 업그레이드 서비스의 리턴값 dto
 */
export class UpdateUserOutput extends CreateUserOutput {}
