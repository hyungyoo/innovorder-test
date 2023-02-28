import { IsString } from "class-validator";
import { CoreOutput } from "./core-output.dto";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO for HTTP Exception Filters,
 * returning either a string or a string array using Core Output
 */
export class HttpExceptionOutput extends CoreOutput {
  @ApiProperty({
    example: {
      message: "에러메세지",
    },
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}
