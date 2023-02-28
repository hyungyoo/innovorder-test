import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsObject } from "class-validator";
import { Users } from "../entities/user.entity";
import { CoreOutput } from "src/common/dtos/core-output.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserOutput extends CoreOutput {
  @IsObject()
  data: { user: Partial<Users> };
}
