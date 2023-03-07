import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";
import {
  ACCESS_TOKEN_BLACKLISTED,
  ACCESS_TOKEN_PAYLOAD_ERROR,
  ACCESS_TOKEN_VALUE,
} from "./interfaces/redis.constants";
import { OpenFoodApiOutput } from "src/food/dtos/food.dto";
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
   *
   * 1. Receives an access token as an argument and checks if it is on the blacklist.
   * 2. After new access token is issued, the previous access token is registered on the blacklist.
   * 3. The time at which the access token is stored in Redis is calculated based on the token using getRemainingSecondsForTokenExpiry.
   * 4. It is stored as a key-value pair.
   * 5. The set function removes duplicates, but duplicates do not cause significant errors and a value is not required.
   * Unlike set, multiple values are not necessary.
   * 6. The expireat function is used to specify the time-to-live (TTL).
   * @param accessToken access token
   */
  async addToBlacklist(accessToken: string) {
    try {
      const isBlacklisted = await this.isTokenBlacklisted(accessToken);
      if (isBlacklisted === ACCESS_TOKEN_VALUE) {
        throw new UnauthorizedException(ACCESS_TOKEN_BLACKLISTED);
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
   * Returns the remaining time in seconds until the expiration time of the access token
   * @param accessToken Access token
   * @returns remaining time (Seconds)
   */
  getRemainingSecondsForTokenExpiry(accessToken: string) {
    try {
      const payload = this.jwtService.decode(accessToken);
      if (!payload["exp"])
        throw new UnauthorizedException(ACCESS_TOKEN_PAYLOAD_ERROR);
      return payload["exp"] - Math.floor(Date.now() / 1000);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Checks if the access token is registered on the blacklist
   * @param accessToken Access token
   * @returns retuns 1 if access token is blacklisted
   */
  async isTokenBlacklisted(accessToken: string) {
    try {
      return await this.blackListClient.get(accessToken);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Adds new food data to Redis.
   * 1. If TTL is set in the env file, the value is set accordingly, otherwise it is set to 600 seconds.
   * 2. The object is serialized.
   * 3. It is stored in Redis using the hash data structure.
   * 4. The expiration time is set.
   * @param barcode barcode
   * @param openFoodApiOutput data for save in Redis
   */
  async addToCacheFoodData(
    barcode: string,
    openFoodApiOutput: OpenFoodApiOutput
  ) {
    try {
      const ttlFormEnv = +this.configService.get("CACHE_TTL");
      const ttl = ttlFormEnv && ttlFormEnv > 0 ? ttlFormEnv : 600;

      const serializedData = JSON.stringify(openFoodApiOutput);
      await this.cacheClient.hset(barcode, barcode, serializedData); // 직렬화된 데이터를 Redis에 저장
      await this.cacheClient.expireat(
        barcode,
        Math.floor(Date.now() / 1000) + ttl
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * If the barcode exists, retrieves the food data and returns it as an object.
   * 1. Searches for the data.
   * 2. If it exists, converts it to an object and returns it.
   * @param barcode barcode
   * @returns Food data as Object
   */
  async getCachedFoodData(barcode: string) {
    try {
      const serializedData = await this.cacheClient.hget(barcode, barcode);
      return JSON.parse(serializedData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
