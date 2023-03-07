import { Users } from "src/users/entities/user.entity";
import { PickType } from "@nestjs/swagger";
import { LogoutOutput } from "./logout.dto";

/**
 * id (number), refreshToken (string)
 */
export class RefreshInput extends PickType(Users, ["id", "refreshToken"]) {}

/**
 * susscess (boolean), code (number)
 */
export class RefreshOutput extends LogoutOutput {}
