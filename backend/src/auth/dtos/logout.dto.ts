import { OmitType } from "@nestjs/swagger";
import { LoginOutput } from "./login.dto";

/**
 * success (boolean), code (number), data (UserWithoutPassword)
 */
export class LogoutOutput extends OmitType(LoginOutput, ["data"]) {}
