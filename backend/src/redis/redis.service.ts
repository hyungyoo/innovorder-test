import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_BLACKLIST_INSTANCE")
    private readonly blackListClient: Redis,
    @Inject("REDIS_CACHE_INSTANCE") private readonly cacheClient: Redis,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 접근토큰을 인자로받아 블랙리스트에 있는지 체크
   * 또한 접근토큰을 새로발급하기때문에 기존 접근토큰은 블랙리스트에등록
   * 레디스에 저장되는시간은 토큰을통해 계산
   * unix epoch로 현재시간 exp가 넘어갔는지
   * @param accessToken 체크해야할 접근토큰
   */
  async addToBlacklist(accessToken: string) {
    try {
      console.log("******** in add to black list *******************");
      const isBlacklisted = await this.isTokenBlacklisted(accessToken);
      if (isBlacklisted) {
        throw new UnauthorizedException(
          "The access token is blacklisted. Access is denied."
        );
      }
      const remainingSeconds =
        this.getRemainingSecondsForTokenExpiry(accessToken);
      if (remainingSeconds > 0) {
        await this.blackListClient.sadd(accessToken, 1, "EX", remainingSeconds);
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  /**
   * Access token에 대해 만료 시간까지 남은 시간을 초 단위로 반환합니다.
   * @param accessToken Access token
   * @returns 토큰 만료까지 남은 시간 (초)
   */
  getRemainingSecondsForTokenExpiry(accessToken: string) {
    try {
      const payload = this.jwtService.decode(accessToken);
      if (!payload["exp"])
        throw new BadRequestException(
          "Access token does not contain 'exp' claim."
        );
      return payload["exp"] - Math.floor(Date.now() / 1000);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Access token이 블랙리스트에 등록되어 있는지 확인합니다.
   * @param accessToken Access token
   * @returns 토큰이 블랙리스트에 등록되어 있다면 1을 반환합니다.
   */
  async isTokenBlacklisted(accessToken: string) {
    try {
      return await this.blackListClient.sismember(accessToken, 1);
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to find token in the blacklist."
      );
    }
  }
}
