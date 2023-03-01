import { IsBoolean, IsString } from "class-validator";
import { CoreOutput } from "./core-output.dto";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO for HTTP Exception Filters,
 * returning either a string or a string array using Core Output
 */
export class HttpExceptionOutput extends CoreOutput {
  @ApiProperty({
    example: false,
    description: "Boolean value (true or false)",
    required: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    example: { message: "Error message" },
    description: "Error message from http execption filter",
    required: true,
  })
  @IsString({ each: true })
  error: {
    message: string | string[];
  };
}
