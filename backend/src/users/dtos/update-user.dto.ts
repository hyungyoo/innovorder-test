import { PartialType } from "@nestjs/swagger";
import { CreateUserInput, CreateUserOutput } from "./create-user.dto";

/**
 * DTO as a partial type from the createUserInput DTO
 */
export class UpdateUserInput extends PartialType(CreateUserInput) {}

/**
 * DTO from the createUserOutput DTO
 */
export class UpdateUserOutput extends CreateUserOutput {}
