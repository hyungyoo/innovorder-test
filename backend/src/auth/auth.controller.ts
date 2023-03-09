import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { LocalGuard } from "./guards/local.guard";
import { AuthUser } from "./decorators/auth-user.decorator";
import { UserWithoutPassword } from "src/users/dtos/create-user.dto";
import { LoginInput } from "./dtos/login.dto";
import { JwtHeaderInterceptor } from "src/Interceptors/jwt.interceptor";
import { AccessTokenGuard } from "./guards/jwt-access.guard";
import { RefreshTokenGuard } from "./guards/jwt-refresh.guard";
import { CustomLogin } from "swaggers/auth/login.decorator";
import { CustomRefresh } from "swaggers/auth/refresh.decorator";
import { CustomLogout } from "swaggers/auth/logout.decorator";

@ApiTags("Auth")
@Controller(`api/v${process.env.API_VERSION}/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User login using passport local, guards, and interceptors
   * 1. Local passport using email and password through localGuard.
   * 2. Pass the user received from AuthUser to the login service
   * 3. Return the user information in the body section,
   * as well as the refresh token and access token in the header section..
   * @param user user
   * @returns header (refresh token, access token), body (user)
   */
  @CustomLogin()
  @UseGuards(LocalGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Post("login")
  @ApiBody({ type: LoginInput })
  login(@AuthUser() user: UserWithoutPassword) {
    return this.authService.login(user);
  }

  /**
   * Delete the hashed refresh token of a user from the database
   * 1. Get the user information using the access token guard and AuthUser decorator.
   * 2. Delete the hashed refresh token of the user from the database.
   * 3. Calculate the remaining time of the access token and register it in the blacklist Redis.
   * @param user user
   * @returns  success (boolean), code (number)
   */
  @CustomLogout()
  @UseGuards(AccessTokenGuard)
  @Get("logout")
  logout(@AuthUser() user: UserWithoutPassword) {
    return this.authService.logout(user);
  }

  /**
   * Authenticate with the user's refresh token and issue a new access token.
   * 1. Use the refresh token from guard.
   * 2. Use the user's ID to re-issue an access token.
   * 3. Before sending response, add refresh and access token to header in the interceptor.
   * @returns header (refresh token, access token)
   */
  @CustomRefresh()
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Get("refresh")
  refresh() {
    return this.authService.refresh();
  }
}
