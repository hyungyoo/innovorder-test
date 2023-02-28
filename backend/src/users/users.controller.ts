import { Controller, Post, Body, Patch, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserInput, CreateUserOutput } from "./dto/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dto/update-user.dto";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { VERSION_SWAGGER } from "src/common/constants/core.constants";

@ApiTags("Users")
@Controller(`api/v${VERSION_SWAGGER}/users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ description: "생성자를 올바르게 생성함" })
  @ApiConflictResponse({ description: "이메일이 이미 존재함" })
  @ApiOperation({
    summary: "Creates a new user",
    description: "이메일, 성, 이름, 비밀번호를 받아 유저를 생성 합니다.",
  })
  @Post()
  createUser(
    @Body() createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

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

  @ApiOkResponse({ description: "생성자를 올바르게 업데이트함" })
  @ApiConflictResponse({ description: "이메일 이미 존재함" })
  @ApiNotFoundResponse({ description: "해당 아이디가 존재하지않음" })
  @ApiOperation({
    summary: "Creates a new user",
    description: "이메일, 성, 이름, 비밀번호 중 원하는것을 업데이트함",
  })
  @Patch(":id")
  updateUser(
    @Param("id") id: string,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    return this.usersService.updateUser(+id, updateUserInput);
  }

  // @ApiOperation({ summary: "delete user" })
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.usersService.remove(+id);
  // }
}
