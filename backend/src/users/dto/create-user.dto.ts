import { PickType } from "@nestjs/swagger";
import { Users } from "../entities/user.entity";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { IsObject } from "class-validator";

export class CreateUserDto extends PickType(Users, [
  "email",
  "firstName",
  "lastName",
  "password",
] as const) {}

export class CreateUserOutput extends CoreOutput {
  @IsObject()
  data: Partial<Users>;
}
