import { PickType } from "@nestjs/swagger";
import { Users } from "src/users/entities/user.entity";

export class LoginInput extends PickType(Users, ["email", "password"]) {}

