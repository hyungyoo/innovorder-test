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
} from "src/common/test/unit-test.interface";
import {
  ACCESS_TOKEN_BLACKLISTED,
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_PAYLOAD_ERROR,
  ACCESS_TOKEN_VALUE,
} from "./interfaces/redis.constants";
import { UnauthorizedException } from "@nestjs/common";

describe("RedisService", () => {
  let redisService: RedisService;
  let jwtService: JwtService;
  let redisBlacklist: MockRedisType;
  let redisCache: MockRedisType;
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
    redisBlacklist = module.get<MockRedisType>("REDIS_BLACKLIST_INSTANCE");
    redisCache = module.get<MockRedisType>("REDIS_CACHE_INSTANCE");
  });

  it("should be defined", () => {
    expect(redisService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
    expect(redisBlacklist).toBeDefined();
    expect(redisCache).toBeDefined();
  });

  describe("addToBlacklist", () => {
    it("접근토큰이 블랙리스트에 등록되어있을경우 실패", async () => {
      redisBlacklist.get.mockResolvedValueOnce(ACCESS_TOKEN_VALUE);

      await expect(
        redisService.addToBlacklist(accessToken)
      ).rejects.toThrowError(ACCESS_TOKEN_BLACKLISTED);

      expect(redisBlacklist.get).toBeCalledTimes(1);
      expect(redisBlacklist.get).toHaveBeenCalledWith(accessToken);
    });

    it("토큰에 남아있는시간이 없다면 만료된것이므로 실패", async () => {
      redisBlacklist.get.mockResolvedValueOnce(null);
      jest
        .spyOn(redisService, "getRemainingSecondsForTokenExpiry")
        .mockReturnValue(-10);

      await expect(
        redisService.addToBlacklist(accessToken)
      ).rejects.toThrowError(ACCESS_TOKEN_EXPIRED);

      expect(redisBlacklist.get).toBeCalledTimes(1);
      expect(redisBlacklist.get).toHaveBeenCalledWith(accessToken);
    });
    it("접근토큰이 블랙리스트에 저장되어있지않다면, 성공적으로 블랙리스트에 접근토큰 저장", async () => {
      redisBlacklist.get.mockResolvedValueOnce(null);
      jest
        .spyOn(redisService, "getRemainingSecondsForTokenExpiry")
        .mockReturnValue(300);

      const result = await redisService.addToBlacklist(accessToken);
      expect(result).toBeUndefined();

      expect(redisBlacklist.get).toBeCalledTimes(1);
      expect(redisBlacklist.get).toHaveBeenCalledWith(accessToken);
    });
  });

  describe("getRemainingSecondsForTokenExpiry", () => {
    it("exp가 없다면 에러", () => {
      expect(
        redisService.getRemainingSecondsForTokenExpiry(accessTokenWithoutExp)
      ).rejects.toThrow(UnauthorizedException);
    });

    it("있다면 성공", async () => {});
  });

  describe("addToCacheFoodData", () => {
    it.todo("서버 에러시 실패");
    it.todo("성공");
  });

  describe("getCachedFoodData", () => {
    it.todo("레디스 서버 접속에러");
    it.todo("성공");
  });
});
