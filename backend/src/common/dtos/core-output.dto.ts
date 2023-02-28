import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

/**
 * Core Output for Nested Structure in DTOs
 */
export class CoreOutput {
  @ApiProperty({
    example: true,
    description: "success 불린값",
    required: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    example: "code",
    description: "코드값",
    required: true,
  })
  @IsNumber()
  code: number;
}
