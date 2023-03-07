import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";
import { ACCESS_TOKEN_VALUE } from "./constants/redis.constants";
import { OpenFoodApiOutput, OpenFoodFactsDto } from "src/food/dtos/food.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_BLACKLIST_INSTANCE")
    private readonly blackListClient: Redis,
    @Inject("REDIS_CACHE_INSTANCE") private readonly cacheClient: Redis,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * 접근토큰을 인자로받아 블랙리스트에 있는지 체크함.
   * 또한 접근토큰을 새로발급하기때문에 기존 접근토큰은 블랙리스트에등록함.
   * 레디스에 저장되는시간은 토큰을통해 계산 (getRemainingSecondsForTokenExpiry)
   * key value자료형으로 저장함.
   * set은 중복을제거하지만, 중복에대해서는 크게 오류가발생하지않으며 value가 필요하지않음
   * set처럼 여러개의 value가 필요하지않음
   * expireat으로 ttl지정
   * @param accessToken 체크해야할 접근토큰
   */
  async addToBlacklist(accessToken: string) {
    try {
      console.log("******** in add to black list *******************");
      const isBlacklisted = await this.isTokenBlacklisted(accessToken);
      console.log(isBlacklisted);
      if (isBlacklisted === ACCESS_TOKEN_VALUE) {
        throw new UnauthorizedException(
          "The access token is blacklisted. Access is denied."
        );
      }
      const remainingSeconds =
        this.getRemainingSecondsForTokenExpiry(accessToken);
      if (remainingSeconds > 0) {
        await this.blackListClient.set(accessToken, ACCESS_TOKEN_VALUE);
        await this.blackListClient.expireat(
          accessToken,
          Math.floor(Date.now() / 1000) + remainingSeconds
        );
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
      return await this.blackListClient.get(accessToken);
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to find token in the blacklist."
      );
    }
  }

  /**
   * 새로운 푸드 데이터를 레디스에 추가
   * Hashes는 Redis에서 여러 필드를 갖는 단일 키에 대한 값을 저장하기 위해 사용하기 적합한 데이터 유형입니다.
   * 객체를 저장하기 위한 목적으로는 Hashes가 가장 자연스러운 선택입니다.
   * Hashes는 필드와 값 사이의 매핑을 갖는 데이터 구조이며,
   * 이 구조는 각 필드와 값을 Redis에서 내부적으로 연결합니다.
   * 객체는 일반적으로 키-값 쌍을 포함하며, 이러한 구조는 Redis Hashes와 유사하게 작동합니다.
   * 객체를 해시로 저장하면 객체의 각 필드를 Redis의 각 필드와 매핑하므로 빠르고 효율적인 검색이 가능합니다.
   * @param openFoodFactsDto 데이터가 가지는 값중에 필요한부분
   */
  async addToCacheFoodData(
    barcode: string,
    openFoodApiOutput: OpenFoodApiOutput
  ) {
    try {
      const ttlFormEnv = +this.configService.get("CACHE_TTL");
      const ttl = ttlFormEnv && ttlFormEnv > 0 ? ttlFormEnv : 600;
      const serializedData = JSON.stringify(openFoodApiOutput);
      console.log(serializedData);
      const result = await this.cacheClient.hset(barcode, serializedData); // 직렬화된 데이터를 Redis에 저장
      await this.cacheClient.expireat(
        barcode,
        Math.floor(Date.now() / 1000) + ttl
      );
    } catch (error) {
      new InternalServerErrorException(error);
    }
  }

  /**
   * 해당 바코드를 조회하여 존재한다면 푸드데이터 반환
   * @param barcode food의 바코드 넘버
   * @returns
   */
  async getCachedFoodData(barcode: string) {
    try {
      // console.log(await this.cacheClient.hgetall(barcode));
      return this.cacheClient.hgetall(barcode);
    } catch (error) {
      new InternalServerErrorException(error);
    }
  }
}
