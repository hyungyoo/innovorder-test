import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";
import {
  ACCESS_TOKEN_BLACKLISTED,
  ACCESS_TOKEN_EXPIRED,
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
   * Check if the access token is in the Redis blacklist, and if it's not, add it to the Redis blacklist.
   * 1. Receives an access token as an argument and checks if it is on the blacklist.
   * 2. After new access token is issued, the previous access token is registered on the blacklist.
   * 3. The time at which the access token is stored in Redis is calculated based on the token using getRemainingSecondsForTokenExpiry.
   * 4. if remainning secondes is under 0, access token is expired, so unauthorized.
   * 5. It is stored as a key-value pair.
   * 6. The set function removes duplicates, but duplicates do not cause significant errors and a value is not required.
   * Unlike set, multiple values are not necessary.
   * 7. The expireat function is used to specify the time-to-live (TTL).
   * @param accessToken access token
   */
  async addToBlacklist(accessToken: string) {
    try {
      const blacklistedAccessToken = await this.blackListClient.get(
        accessToken
      );
      if (
        blacklistedAccessToken !== null &&
        blacklistedAccessToken === ACCESS_TOKEN_VALUE
      ) {
        throw new HttpException(
          ACCESS_TOKEN_BLACKLISTED,
          HttpStatus.UNAUTHORIZED
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
      } else
        throw new HttpException(ACCESS_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
    } catch (error) {
      throw new InternalServerErrorException(error);
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
        throw new HttpException(
          ACCESS_TOKEN_PAYLOAD_ERROR,
          HttpStatus.UNAUTHORIZED
        );
      return payload["exp"] - Math.floor(Date.now() / 1000);
    } catch (error) {
      console.log("why?");
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
