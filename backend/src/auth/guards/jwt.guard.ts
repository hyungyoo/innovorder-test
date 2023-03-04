import { AuthGuard } from "@nestjs/passport";

export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
  constructor() {
    super();
  }
}

export class AccessTokenGuard extends AuthGuard("jwt-access") {
  constructor() {
    super();
  }
}
