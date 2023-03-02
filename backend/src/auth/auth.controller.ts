import { Controller, Get, Post } from "@nestjs/common";
import { VERSION_SWAGGER } from "src/common/constants/core.constants";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller(`api/v${VERSION_SWAGGER}/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Create and save refresh token in DB
   */
  @Post("login")
  login() {
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
