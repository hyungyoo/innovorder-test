import { IsString } from "class-validator";
import { CoreOutput } from "./core-output.dto";

export class HttpExceptionOutput extends CoreOutput {
  @IsString({ each: true })
  data: string | string[];
}
