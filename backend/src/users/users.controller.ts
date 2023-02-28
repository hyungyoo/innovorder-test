import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, CreateUserOutput } from "./dto/create-user.dto";
import { UpdateUserDto, UpdateUserOutput } from "./dto/update-user.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Creates a new user" })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<CreateUserOutput> {
    return this.usersService.create(createUserDto);
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

  @ApiOperation({ summary: "update user" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UpdateUserOutput> {
    return this.usersService.update(+id, updateUserDto);
  }

  // @ApiOperation({ summary: "delete user" })
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.usersService.remove(+id);
  // }
}
