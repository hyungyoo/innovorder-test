import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
  constructor() {
    super();
  }
}

@Injectable()
export class AccessTokenGuard extends AuthGuard("jwt-access") {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  /**
   * AuthGuard를 상속하므로, jwt-refresh strategy를 실행하기전에
   * 접근토큰이 블랙리스트에 있는지 확인
   * 또한 새로운 접근토큰을 발급하기때문에 기존 접근토큰은 블랙리스트에 등록
   * @param context 리프레쉬토큰을 얻을수있는 실행컨텍스트
   * @returns
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(
      "******************** AccessToken check black list **********************************"
    );
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      context.switchToHttp().getRequest()
    );
    await this.redisService.addToBlacklist(accessToken);
    await super.canActivate(context);
    return true;
  }
}
