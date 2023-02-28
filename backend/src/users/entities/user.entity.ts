import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CoreEntity } from "src/common/entites/core.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Users extends CoreEntity {
  @ApiProperty({
    example: "hyungyoo@innovorder.fr",
    description:
      "유저가 입력하는 유저의 이메일, 또한 이메일의 형태여야하며, 유니크해야한다",
    required: true,
  })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "hyungjun",
    description: "유저가 입력하는 유저의 이름",
    required: true,
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  fistName: string;

  @ApiProperty({
    example: "yoo",
    description: "유저가 입력하는 유저의 성",
    required: true,
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: "12345",
    description: "유저가 입력하는 비밀번호",
    required: true,
  })
  @Column({ select: false })
  @IsString()
  @IsNotEmpty()
  password: string;
}
