import { ApiProperty } from "@nestjs/swagger";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from "class-validator";
import { Users } from "../entities/user.entity";
import { HttpStatus } from "@nestjs/common";

/**
 * 유저를 생성하기위한 dto
 */
export class CreateUserInput {
  @ApiProperty({
    example: "hyungyoo@innovorder.fr",
    description:
      "The user-entered user email should be in the correct email format and must be unique",
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "hyungjun",
    description: "The user's first name",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: "yoo",
    description: "The user's last name",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: "12345",
    description: "The user's password",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * 유저생성 서비스의 리턴값 dto
 */
export class CreateUserOutput extends CoreOutput {
  @ApiProperty({
    example: HttpStatus.CREATED,
    description: "코드값",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    example: {
      user: {
        id: 1,
        createdAt: "2023-03-01T00:00:00.000Z",
        updatedAt: "2023-03-01T00:00:00.000Z",
        email: "hyungyoo@innovorder.fr",
        firstName: "hyungjun",
        lastName: "yoo",
      },
    },
    description: "패스워드를 제외한 나머지 정보 반환",
    required: true,
  })
  @IsObject()
  data: { user: Omit<Users, "password" | "makeHashedPW"> };
}
