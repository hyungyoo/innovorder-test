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
    it("접근토큰이 블랙리스트에 등록되어있을경우 실패", async () => {
      blacklistClient.get.mockResolvedValueOnce(ACCESS_TOKEN_VALUE);

      await expect(
        redisService.addToBlacklist(accessToken)
      ).rejects.toThrowError(ACCESS_TOKEN_BLACKLISTED);

      expect(blacklistClient.get).toBeCalledTimes(1);
      expect(blacklistClient.get).toHaveBeenCalledWith(accessToken);
    });

    it("토큰에 남아있는시간이 없다면 만료된것이므로 실패", async () => {
      blacklistClient.get.mockResolvedValueOnce(null);
      jest
        .spyOn(redisService, "getRemainingSecondsForTokenExpiry")
        .mockReturnValue(-10);

      await expect(
        redisService.addToBlacklist(accessToken)
      ).rejects.toThrowError(ACCESS_TOKEN_EXPIRED);

      expect(blacklistClient.get).toBeCalledTimes(1);
      expect(blacklistClient.get).toHaveBeenCalledWith(accessToken);
    });
    it("접근토큰이 블랙리스트에 저장되어있지않다면, 성공적으로 블랙리스트에 접근토큰 저장", async () => {
      blacklistClient.get.mockResolvedValueOnce(null);
      jest
        .spyOn(redisService, "getRemainingSecondsForTokenExpiry")
        .mockReturnValue(300);

      const result = await redisService.addToBlacklist(accessToken);
      expect(result).toBeUndefined();

      expect(blacklistClient.get).toBeCalledTimes(1);
      expect(blacklistClient.get).toHaveBeenCalledWith(accessToken);
    });
  });

  describe("getRemainingSecondsForTokenExpiry", () => {
    it("exp가 없다면 에러", () => {
      const result = redisService.getRemainingSecondsForTokenExpiry(
        accessTokenWithoutExp
      );
      expect(result).toBe(EXP_NOT_EXISTS);
    });

    it("있다면 성공", async () => {
      const result =
        redisService.getRemainingSecondsForTokenExpiry(accessToken);
      expect(result).toBe(600);
    });
  });

  describe("addToCacheFoodData", () => {
    it("서버 에러시 실패", async () => {
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

    it("성공", async () => {
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
      expect(cacheClient.expireat).toBeCalledTimes(1);
      expect(cacheClient.expireat).toBeCalledWith(barcode, expect.any(Number));
    });
  });

  describe("getCachedFoodData", () => {
    it("레디스 서버 접속에러", async () => {
      cacheClient.hget.mockRejectedValueOnce(new Error());

      await expect(
        redisService.getCachedFoodData(barcode)
      ).rejects.toThrowError(new Error());

      expect(cacheClient.hget).toBeCalledTimes(1);
      expect(cacheClient.hget).toBeCalledWith(barcode, barcode);
    });
    it("성공", async () => {
      cacheClient.hget.mockResolvedValueOnce(serializedData);

      const result = await redisService.getCachedFoodData(barcode);
      expect(result).toStrictEqual(JSON.parse(serializedData));

      expect(cacheClient.hget).toBeCalledTimes(1);
      expect(cacheClient.hget).toBeCalledWith(barcode, barcode);
    });
  });
});
