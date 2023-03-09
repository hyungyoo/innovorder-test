import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { RedisService } from "src/redis/redis.service";
import { FoodService } from "./food.service";
import {
  MockConfigService,
  MockHttpservice,
  MockRedisService,
} from "src/common/test/unit-test.mock";

describe("FoodService", () => {
  let foodService: FoodService;
  let configService: ConfigService;
  let httpService: HttpService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        {
          provide: ConfigService,
          useValue: MockConfigService(),
        },
        {
          provide: HttpService,
          useValue: MockHttpservice(),
        },
        {
          provide: RedisService,
          useValue: MockRedisService(),
        },
      ],
    }).compile();

    foodService = module.get<FoodService>(FoodService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
    redisService = module.get<RedisService>(RedisService);
  });

  it("should be defined", () => {
    expect(foodService).toBeDefined();
  });
});
