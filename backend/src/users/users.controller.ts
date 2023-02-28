import { Controller, Post, Body, Patch, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserInput, CreateUserOutput } from "./dto/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { VERSION_SWAGGER } from "src/common/constants/core.constants";

@ApiTags("Users")
@Controller(`api/v${VERSION_SWAGGER}/users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
