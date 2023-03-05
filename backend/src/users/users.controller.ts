import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  CreateUserInput,
  CreateUserOutput,
  UserWithoutPassword,
} from "./dtos/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { CustomUserCreate } from "src/users/decorators/create-user.decorators";
import { CustomUserUpdate } from "src/users/decorators/update-user.decorator";
import { Users } from "./entities/user.entity";
import { UndefinedToNullInterceptor } from "src/Interceptors/undefinedToNull.interceptor";
import { AccessTokenGuard } from "src/auth/guards/jwt.guard";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { JwtHeaderInterceptor } from "src/Interceptors/jwt.interceptor";

@ApiExtraModels(Users)
@ApiTags("Users")
@UseInterceptors(UndefinedToNullInterceptor)
@Controller(`api/v${process.env.API_VERSION}/users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   *
   * @param createUserInput 유저생성을 하기위한 정보
   * @returns 성공 불린값, http 상태코드, 데이터
   */
  @CustomUserCreate()
  @Post()
  createUser(
    @Body() createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  /**
   *
   * @param user
   * @param updateUserInput
   * @returns
   */
  @CustomUserUpdate()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Patch()
  updateUser(
    @AuthUser() { id }: UserWithoutPassword,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    return this.usersService.updateUser(id, updateUserInput);
  }
}

// @CustomUserUpdate()
// @Patch(":id")
// updateUserById(
//   @Param("id", ParseIntPipe) id: number,
//   @Body() updateUserInput: UpdateUserInput
// ): Promise<UpdateUserOutput> {
//   return this.usersService.updateUser(id, updateUserInput);
// }

// @ApiOperation({ summary: "get all users" })
// @Get()
// findAll() {
//   return this.usersService.findAll();
// }

// @ApiOperation({ summary: "get user by user id" })
// @Get(":id")
// findOne(@Param("id") id: string) {
//   return this.usersService.findOne(+id);
// }

// @ApiOperation({ summary: "delete user" })
// @Delete(":id")
// remove(@Param("id") id: string) {
//   return this.usersService.remove(+id);
// }
