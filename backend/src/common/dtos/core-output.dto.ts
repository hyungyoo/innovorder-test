import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

/**
 * Core Output for Nested Structure in DTOs
 */
export class CoreOutput {
  @ApiProperty({
    example: true,
    description: "Boolean value (true or false)",
    required: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    example: HttpStatus.CREATED,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;
}
