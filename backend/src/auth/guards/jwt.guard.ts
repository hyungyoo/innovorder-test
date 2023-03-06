import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Observable } from "rxjs";
import { RedisService } from "src/redis/redis.service";

export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
  constructor() {
    super();
  }
}

export class AccessTokenGuard extends AuthGuard("jwt-access") {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  /**
   *
   * @param context
   * @returns
   */
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(
      "******************** AccessToken check black list **********************************"
    );
    /**
     * 블랙이면 바로 false
     * 아니면 블랙에 추가하고 넘기기 true
     */
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest()
    );
    return super.canActivate(context);
  }
}
