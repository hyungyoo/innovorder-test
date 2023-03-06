import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly authService: AuthService
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
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }
    if (updateUserInput.email) {
      const isEmailExists = await this.checkEmailExists(updateUserInput.email);
      if (isEmailExists && user.email === updateUserInput.email) {
        throw new ConflictException("That email already exists for a user");
      }
    }
    const { password, refreshToken, ...updatedUser } =
      await this.usersRepository.save(
        this.usersRepository.create({ ...user, ...updateUserInput })
      );
    await this.generateNewAccessToken(id);
    return {
      success: true,
      code: HttpStatus.OK,
      data: { user: updatedUser },
    };
  }

  /**
   * Checks if email already exists in the database
   * @param email
   * @returns boolean indicating whether the email exists or not
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }

  /**
   * Find and return a user with the given ID
   * @param id
   * @returns Users or null
   */
  findUserById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * 유저의 id를 받아, 새로운 접근토큰을 발급하여 클라이언트의 헤더에 추가.
   * @param id 유저 id
   */
  async generateNewAccessToken(id: number) {
    const [access] = await this.authService.generateTokens(id);
    this.authService.tokens = [access, undefined];
  }
}

// async findAll() {
//   return `This action returns all users`;
// }

// findOne(id: number) {
//   return `This action returns a #${id} user`;
// }
