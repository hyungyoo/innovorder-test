import { AuthGuard } from "@nestjs/passport";

export class RefreshTokenGuard extends AuthGuard("refreshToken") {
  constructor() {
    super();
  }
}

export class AccessTokenGuard extends AuthGuard("accessToken") {
  constructor() {
    super();
  }
}
