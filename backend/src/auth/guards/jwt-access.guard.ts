import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class AccessTokenGuard extends AuthGuard("jwt-access") {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  /**
   * Since it inherits from AuthGuard, it checks 
   * if the access token is blacklisted before executing the jwt-access strategy.
   * It also adds the previous access token to the blacklist because a new access token is issued.
   * After that, it calls the parent's canActivate function (jwt-access strategy).
   * @param context 리프레쉬토큰을 얻을수있는 실행컨텍스트
   * @returns true
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
        context.switchToHttp().getRequest()
      );
      await this.redisService.addToBlacklist(accessToken);
      await super.canActivate(context);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
