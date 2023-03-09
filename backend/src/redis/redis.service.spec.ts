import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";
import {
  MockConfigService,
  MockJwtService,
  MockRedisBlacklist,
  MockRedisClient,
} from "src/common/test/unit-test.mock";
import {
  MockRedisType,
  accessToken,
  accessTokenWithoutExp,
  barcode,
  serializedData,
} from "src/common/test/unit-test.interface";
import {
  ACCESS_TOKEN_BLACKLISTED,
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_VALUE,
  EXP_NOT_EXISTS,
} from "./interfaces/redis.constants";

describe("RedisService", () => {
  let redisService: RedisService;
  let jwtService: JwtService;
  let blacklistClient: MockRedisType;
  let cacheClient: MockRedisType;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: JwtService,
          useValue: MockJwtService(),
        },
        {
          provide: "REDIS_BLACKLIST_INSTANCE",
          useValue: MockRedisBlacklist(),
        },
        {
          provide: "REDIS_CACHE_INSTANCE",
          useValue: MockRedisClient(),
        },
        {
          provide: ConfigService,
          useValue: MockConfigService(),
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    blacklistClient = module.get<MockRedisType>("REDIS_BLACKLIST_INSTANCE");
    cacheClient = module.get<MockRedisType>("REDIS_CACHE_INSTANCE");
  });

  it("should be defined", () => {
    expect(redisService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
    expect(blacklistClient).toBeDefined();
    expect(cacheClient).toBeDefined();
  });

  describe("addToBlacklist", () => {
    it("should fail when an access token is registered on the blacklist", async () => {
      blacklistClient.get.mockResolvedValueOnce(ACCESS_TOKEN_VALUE);
      jest
        .spyOn(redisService, "getRemainingSecondsForTokenExpiry")
        .mockReturnValue(300);

      await expect(
        redisService.addToBlacklist(accessToken)
      ).rejects.toThrowError(ACCESS_TOKEN_BLACKLISTED);

      expect(blacklistClient.get).toBeCalledTimes(1);
      expect(blacklistClient.get).toHaveBeenCalledWith(accessToken);
      expect(redisService.getRemainingSecondsForTokenExpiry).toBeCalledTimes(0);
    });

    it("should fail if there is no remaining time for the token", async () => {
      blacklistClient.get.mockResolvedValueOnce(null);
      jest
        .spyOn(redisService, "getRemainingSecondsForTokenExpiry")
        .mockReturnValue(-10);

      await expect(
        redisService.addToBlacklist(accessToken)
      ).rejects.toThrowError(ACCESS_TOKEN_EXPIRED);

      expect(blacklistClient.get).toBeCalledTimes(1);
      expect(blacklistClient.get).toHaveBeenCalledWith(accessToken);
      expect(redisService.getRemainingSecondsForTokenExpiry).toBeCalledTimes(1);
    });

    it("should successfully save the access token to the blacklist if it is not already stored in the blacklist", async () => {
      blacklistClient.get.mockResolvedValueOnce(null);
      jest
        .spyOn(redisService, "getRemainingSecondsForTokenExpiry")
        .mockReturnValue(300);

      const result = await redisService.addToBlacklist(accessToken);
      expect(result).toBeUndefined();

      expect(blacklistClient.get).toBeCalledTimes(1);
      expect(blacklistClient.get).toHaveBeenCalledWith(accessToken);
      expect(redisService.getRemainingSecondsForTokenExpiry).toBeCalledTimes(1);
      expect(redisService.getRemainingSecondsForTokenExpiry).toBeCalledWith(
        accessToken
      );
    });
  });

  describe("getRemainingSecondsForTokenExpiry", () => {
    it("should return EXP_NOT_EXISTES if the 'exp' property is missing in access token", () => {
      const result = redisService.getRemainingSecondsForTokenExpiry(
        accessTokenWithoutExp
      );
      expect(result).toBe(EXP_NOT_EXISTS);
    });

    it("should successfuly return remaining time", async () => {
      const result =
        redisService.getRemainingSecondsForTokenExpiry(accessToken);
      expect(result).toBe(600);
    });
  });

  describe("addToCacheFoodData", () => {
    it("should throw an error if the connection to the Redis server fails", async () => {
      cacheClient.hset.mockRejectedValueOnce(new Error());

      await expect(
        redisService.addToCacheFoodData(barcode, expect.any(Object))
      ).rejects.toThrowError(new Error());

      expect(cacheClient.hset).toBeCalledTimes(1);
      expect(cacheClient.hset).toBeCalledWith(
        barcode,
        barcode,
        expect.any(String)
      );
      expect(cacheClient.expireat).toBeCalledTimes(0);
    });

    it("should successfuly save food data in redis", async () => {
      jest.spyOn(configService, "get").mockReturnValueOnce(300);

      const result = await redisService.addToCacheFoodData(
        barcode,
        expect.any(Object)
      );
      expect(result).toBeUndefined();

      expect(cacheClient.hset).toBeCalledTimes(1);
      expect(cacheClient.hset).toBeCalledWith(
        barcode,
        barcode,
        expect.any(String)
      );
      expect(configService.get).toBeCalledTimes(1);
      expect(configService.get).toBeCalledWith("CACHE_TTL");
      expect(cacheClient.expireat).toBeCalledTimes(1);
      expect(cacheClient.expireat).toBeCalledWith(barcode, expect.any(Number));
    });
  });

  describe("getCachedFoodData", () => {
    it("should throw an error if the connection to the Redis server fails", async () => {
      cacheClient.hget.mockRejectedValueOnce(new Error());

      await expect(
        redisService.getCachedFoodData(barcode)
      ).rejects.toThrowError(new Error());

      expect(cacheClient.hget).toBeCalledTimes(1);
      expect(cacheClient.hget).toBeCalledWith(barcode, barcode);
    });

    it("should successfuly get food data from redis", async () => {
      cacheClient.hget.mockResolvedValueOnce(serializedData);

      const result = await redisService.getCachedFoodData(barcode);
      expect(result).toStrictEqual(JSON.parse(serializedData));

      expect(cacheClient.hget).toBeCalledTimes(1);
      expect(cacheClient.hget).toBeCalledWith(barcode, barcode);
    });
  });
});
