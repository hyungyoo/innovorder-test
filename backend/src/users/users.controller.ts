import { Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UndefinedToNullInterceptor } from "src/Interceptors/undefinedToNull.interceptor";

@UseInterceptors(UndefinedToNullInterceptor)
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
