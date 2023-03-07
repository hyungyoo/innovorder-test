import { PickType } from "@nestjs/swagger";
import { CreateUserOutput } from "src/users/dtos/create-user.dto";
import { Users } from "src/users/entities/user.entity";

/**
 * email (string), password (string)
 */
export class LoginInput extends PickType(Users, ["email", "password"]) {}

/*
 * success (boolean), code (number), data (UserWithoutPassword)
 */
export class LoginOutput extends CreateUserOutput {}
