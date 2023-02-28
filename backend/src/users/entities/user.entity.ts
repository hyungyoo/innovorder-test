import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CoreEntity } from "src/common/entites/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from "bcryptjs";
import { HttpException, HttpStatus } from "@nestjs/common";

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

  /**
   * hashing the password with bcrypt
   * Before a user entity is saved or updated,
   * the password of the object is hashed.
   * If the password is included in the updateUserDto during an update,
   * then the password is hashed
   */
  @BeforeInsert()
  @BeforeUpdate()
  async makeHashedPW(): Promise<void> {
    try {
      if (this.password) {
        const saltRounds = +process.env.SALT_ROUNDS || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
