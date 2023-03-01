import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserInput, CreateUserOutput } from "./dto/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dto/update-user.dto";
import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { VERSION_SWAGGER } from "src/common/constants/core.constants";
import { CustomUserCreate } from "src/users/decorators/create-user.decorators";
import { CustomUserUpdate } from "src/users/decorators/update-user.decorator";
import { Users } from "./entities/user.entity";

@ApiExtraModels(Users)
@ApiTags("Users")
@Controller(`api/v${VERSION_SWAGGER}/users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @CustomUserCreate()
  @Post()
  createUser(
    @Body() createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  @CustomUserUpdate()
  @Patch(":id")
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    return this.usersService.updateUser(id, updateUserInput);
  }
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

// @ApiOperation({ summary: "delete user" })
// @Delete(":id")
// remove(@Param("id") id: string) {
//   return this.usersService.remove(+id);
// }
