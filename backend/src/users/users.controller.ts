import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserInput, CreateUserOutput } from "./dto/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<CreateUserOutput> {
    return this.usersService.create(createUserInput);
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
  update(
    @Param("id") id: string,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    return this.usersService.update(+id, updateUserInput);
  }

  // @ApiOperation({ summary: "delete user" })
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.usersService.remove(+id);
  // }
}
