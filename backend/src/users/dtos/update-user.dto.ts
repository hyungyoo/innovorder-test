import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserInput, UserWithoutPassword } from "./create-user.dto";
import { IsObject, IsString } from "class-validator";
import { CoreOutput } from "src/common/dtos/core-output.dto";

/**
 * DTO as a partial type from the createUserInput DTO
 */
export class UpdateUserInput extends PartialType(CreateUserInput) {}

/**
 * DTO from the CoreOutput
 */
export class UpdateUserOutput extends CoreOutput {
  @ApiProperty({ type: UserWithoutPassword })
  @IsObject()
  data?: { user: UserWithoutPassword };

  @ApiProperty({
    example: { message: "Error message" },
    description: "Error message from http execption filter",
    required: false,
  })
  @IsString({ each: true })
  error?: {
    message: string | string[];
  };
}
