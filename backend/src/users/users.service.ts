import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto, CreateUserOutput } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExists = await this.checkEmailExists(createUserDto.email);
    if (isEmailExists) {
      throw new ConflictException("That email already exists for a user");
    }
    const user = await this.usersRepository.save(
      this.usersRepository.create(createUserDto)
    );
    const { password, ...result } = user;
    return {
      success: true,
      code: HttpStatus.CREATED,
      data: result,
    };
  }

  async findAll() {
    // return `This action returns all users`;
    // throw new BadRequestException("bad request");
    throw new UnauthorizedException("이미 존재하는 사용자?");
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }
}
