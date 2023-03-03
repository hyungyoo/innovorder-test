import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { VERSION_SWAGGER } from "src/common/constants/core.constants";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { LocalGuard } from "./guards/local.guard";
import { UndefinedToNullInterceptor } from "src/Interceptors/undefinedToNull.interceptor";
import { AuthUser } from "./decorators/login.decorator";
import { UserWithoutPassword } from "src/users/dtos/create-user.dto";

@ApiTags("Auth")
@UseInterceptors(UndefinedToNullInterceptor)
@Controller(`api/v${VERSION_SWAGGER}/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Create and save refresh token in DB
   */
  @UseGuards(LocalGuard)
  @Post("login")
  login(@AuthUser() user: UserWithoutPassword) {
    console.log(user);
    return this.authService.login();
  }

  /**
   * Delete refresh token from DB
   */
  @Get("logout")
  logout() {
    return this.authService.logout();
  }

  /**
   * Compare refresh token in DB
   */
  @Get("refresh")
  refresh() {
    return this.authService.refresh();
  }
}
