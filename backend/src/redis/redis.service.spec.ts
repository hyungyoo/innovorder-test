import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";

const MockJwtService = () => ({
  decode: jest.fn(),
});

const MockRedisBlacklist = () => ({
  set: jest.fn(),
  expireat: jest.fn(),
  get: jest.fn(),
});

const MockRedisClient = () => ({
  hset: jest.fn(),
  expireat: jest.fn(),
  hget: jest.fn(),
});

const MockConfigService = () => ({
  get: jest.fn(),
});

describe("RedisService", () => {
  let redisService: RedisService;

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
  });

  it("should be defined", () => {
    expect(redisService).toBeDefined();
  });
});
