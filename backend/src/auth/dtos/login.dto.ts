import { PickType } from "@nestjs/swagger";
import { CreateUserOutput } from "src/users/dtos/create-user.dto";
import { Users } from "src/users/entities/user.entity";

export class LoginInput extends PickType(Users, ["email", "password"]) {}

export class LoginOutput extends CreateUserOutput {}
