import { OmitType } from "@nestjs/mapped-types";
import { LoginOutput } from "./login.dto";
import { Users } from "src/users/entities/user.entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";

/**
 * user type for input.
 */
export class RefreshInput extends PickType(Users, ["id", "refreshToken"]) {}

export class RefreshOutput extends OmitType(LoginOutput, ["data"]) {}
