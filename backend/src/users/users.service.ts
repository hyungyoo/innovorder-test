import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>
  ) {}

  /**
   * It receives createUserDto as an argument
   * and is responsible for creating a new user
   * @param createUserDto
   * @returns Promise<CreateUserOutput>
   */
  async create(createUserDto: CreateUserDto) {
    const isEmailExists = await this.checkEmailExists(createUserDto.email);
    if (isEmailExists) {
      throw new ConflictException("That email already exists for a user");
    }
    const user = await this.usersRepository.save(
      this.usersRepository.create(createUserDto)
    );
    const { password, ...data } = user;
    return {
      success: true,
      code: HttpStatus.CREATED,
      data,
    };
  }

  async findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  /**
   * It receives updateUserDto and user's id as an argument
   * and is responsible for updating a user
   * @param id
   * @param updateUserDto
   * @returns Promise<UpdateUserOutput>
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (updateUserDto.email) {
      const isEmailExists = await this.checkEmailExists(updateUserDto.email);
      if (isEmailExists && user.email === updateUserDto.email) {
        throw new ConflictException("That email already exists for a user");
      }
    }
    const { ...data } = await this.usersRepository.save(
      this.usersRepository.create({ ...user, ...updateUserDto })
    );
    return {
      success: true,
      code: HttpStatus.OK,
      data,
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

  async findUserById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }
}
