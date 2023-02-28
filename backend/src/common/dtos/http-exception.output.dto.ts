import { IsBoolean, IsNumber, IsString } from "class-validator";
import { CoreOutput } from "./core-output.dto";

/**
 * DTO for HTTP Exception Filters,
 * returning either a string or a string array using Core Output
 */
export class HttpExceptionOutput extends CoreOutput {
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}
