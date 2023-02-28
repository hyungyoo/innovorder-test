import { CoreOutput } from "src/common/dtos/core-output.dto";
import { IsObject } from "class-validator";
import { Users } from "../entities/user.entity";
import { PickType } from "@nestjs/mapped-types";

/**
 * 유저를 생성하기위한 dto
 */
export class CreateUserInput extends PickType(Users, [
  "email",
  "firstName",
  "lastName",
  "password",
]) {}

/**
 * 유저생성 서비스의 리턴값 dto
 */
export class CreateUserOutput extends CoreOutput {
  @IsObject()
  data: { user: Omit<Users, "password" | "makeHashedPW"> };
}
