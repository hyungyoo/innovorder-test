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
import { UndefinedToNullInterceptor } from "src/Interceptors/undefinedToNull.interceptor";
import { AuthUser } from "./decorators/auth-user.decorator";
import { UserWithoutPassword } from "src/users/dtos/create-user.dto";
import { LoginInput } from "./dtos/login.dto";
import { JwtHeaderInterceptor } from "src/Interceptors/jwt.interceptor";
import { AccessTokenGuard, RefreshTokenGuard } from "./guards/jwt.guard";
import { RefreshInput } from "./dtos/refresh.dto";

@ApiTags("Auth")
@UseInterceptors(UndefinedToNullInterceptor)
@Controller(`api/v${process.env.API_VERSION}/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * http요청 바디로부터 들어온 loginInput에서의 이메일과 비밀번호를 이용하여
   * localGuard에서 localStrategy를 통해 로그인성공후,
   * login 서비스에서 접근토큰과 리프레쉬토큰을 생성
   * 헤더에 접근토큰과 리프레쉬토큰을 추가하여,
   * 유저정보와 상태코드를 반환합니다.
   */
  @UseGuards(LocalGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Post("login")
  @ApiBody({ type: LoginInput })
  login(@AuthUser() user: UserWithoutPassword) {
    return this.authService.login(user);
  }

  /**
   * Delete refresh token from DB
   */
  @UseGuards(AccessTokenGuard)
  @Get("logout")
  logout(@AuthUser() user: UserWithoutPassword) {
    return this.authService.logout(user);
  }

  /**
   * Compare refresh token in DB
   */
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Get("refresh")
  refresh(@AuthUser() user: RefreshInput) {
    return this.authService.refresh(user);
  }
}
