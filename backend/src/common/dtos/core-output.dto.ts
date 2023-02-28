import { IsBoolean, IsNumber } from "class-validator";

/**
 * Core Output for Nested Structure in DTOs
 */
export class CoreOutput {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  code: number;
}
