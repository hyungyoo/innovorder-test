import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CoreEntity } from "src/common/entites/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from "bcryptjs";
import { UnprocessableEntityException } from "@nestjs/common";
import { SALT_ROUNDS } from "src/common/constants/core.constants";
import { USER_UNPROCESSABLE_ENTITY } from "src/users/constants/user.constants";

@Entity()
export class Users extends CoreEntity {
  @ApiProperty({
    example: "hyungyoo@innovorder.fr",
    description:
      "The user-entered user email should be in the correct email format and must be unique",
    required: true,
  })
  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "hyungjun",
    description: "The user's first name",
    required: true,
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: "yoo",
    description: "The user's last name",
    required: true,
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: "12345",
    description: "The user's password",
    required: true,
  })
  @Column({ select: false })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: "header.payload.sign",
    description: "The user's refresh token",
  })
  @Column({ select: false, nullable: true, default: null })
  @IsString()
  refreshToken?: string;

  /**
   * hashing the password with bcrypt
   * Before a user entity is saved or updated,
   * the password of the object is hashed.
   * If the password is included in the updateUserDto during an update,
   * then the password is hashed
   * If bcrypt throws an error, raise an UnprocessableEntityException.
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      if (this.password) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        this.password = await bcrypt.hash(this.password, salt);
      }
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException(USER_UNPROCESSABLE_ENTITY);
    }
  }
}
