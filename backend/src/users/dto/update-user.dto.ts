import { CreateUserOutput } from "./create-user.dto";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserInput {
  @ApiProperty({
    example: "hyungyoo@innovorder.fr",
    description:
      "The user-entered user email should be in the correct email format and must be unique",
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "12345",
    description: "The user's password",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserOutput extends CreateUserOutput {}
