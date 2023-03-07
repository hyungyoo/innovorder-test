import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) {}

  /**
   * It receives createUserInput as an argument
   * and is responsible for creating a new user.
   * @param createUserInput
   * @returns Promise<CreateUserOutput>
   */
  async createUser(
    createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      const isEmailExists = await this.checkEmailExists(createUserInput.email);
      if (isEmailExists) {
        throw new ConflictException("That email already exists for a user");
      }
      const { password, refreshToken, ...createdUser } =
        await this.usersRepository.save(
          this.usersRepository.create(createUserInput)
        );
      return {
        success: true,
        code: HttpStatus.CREATED,
        data: { user: createdUser },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * It receives updateUserInput and user's id as an argument
   * and is responsible for updating a user.
   * @param id
   * @param updateUserInput
   * @returns Promise<UpdateUserOutput>
   */
  async updateUser(
    id: number,
    updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ${id} not found`);
      }
      if (updateUserInput.email) {
        const isEmailExists = await this.checkEmailExists(
          updateUserInput.email
        );
        if (isEmailExists && user.email === updateUserInput.email) {
          throw new ConflictException("That email already exists for a user");
        }
      }
      const { password, refreshToken, ...updatedUser } =
        await this.usersRepository.save(
          this.usersRepository.create({ ...user, ...updateUserInput })
        );
      return {
        success: true,
        code: HttpStatus.OK,
        data: { user: updatedUser },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Checks if email already exists in the database
   * @param email
   * @returns boolean indicating whether the email exists or not
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return !!user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Find and return a user with the given ID
   * @param id
   * @returns Users or null
   */
  findUserById(id: number) {
    try {
      return this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

// async findAll() {
//   return `This action returns all users`;
// }

// findOne(id: number) {
//   return `This action returns a #${id} user`;
// }
