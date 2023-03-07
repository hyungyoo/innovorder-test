import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateUserInput,
  CreateUserOutput,
  UserWithoutPassword,
} from "./dtos/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";
import {
  USER_CONFLICT_RESPONSE,
  USER_NOT_FOUND_RESPONSE,
} from "./constants/user.constants";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) {}

  /**
   * It receives createUserInput as an argument
   * and is responsible for creating a new user.
   * 1. Check if there is a user with the given ID.
   * 2. Check for email duplication.
   * 3. Create and return the user without password.
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
   * 1. Check if there is a user with the given ID from access token.
   * 2. Check for email duplication.
   * 3. Update and return the user without password and refresh token.
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
        throw new NotFoundException(USER_NOT_FOUND_RESPONSE);
      }

      if (updateUserInput.email) {
        const isEmailExists = await this.checkEmailExists(
          updateUserInput.email
        );
        if (isEmailExists && user.email === updateUserInput.email) {
          return this.getReturnValue();
        }
      }

      const { password, refreshToken, ...updatedUser } =
        await this.usersRepository.save(
          this.usersRepository.create({ ...user, ...updateUserInput })
        );
      return this.getReturnValue(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Returns response
   * @param user
   * @returns success (boolean), code (number),  data or error
   */
  getReturnValue(user?: UserWithoutPassword) {
    try {
      if (user) {
        return {
          success: true,
          code: HttpStatus.OK,
          data: { user },
        };
      } else {
        return {
          success: true,
          code: HttpStatus.CONFLICT,
          error: { message: USER_CONFLICT_RESPONSE },
        };
      }
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
