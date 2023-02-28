import { IsBoolean, IsNumber } from "class-validator";

export class CoreOutput {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  code: number;
}
