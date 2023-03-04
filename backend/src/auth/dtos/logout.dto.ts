import { OmitType } from "@nestjs/swagger";
import { LoginOutput } from "./login.dto";

export class LogoutOutput extends OmitType(LoginOutput, ["data"]) {}
