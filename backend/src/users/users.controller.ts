import { Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("api/users")
export class UsersController {
  @Get()
  getUsers() {}

  @Post()
  postUsers() {}

  @Post("login")
  login() {}

  @Post("logout")
  logout() {}
}
