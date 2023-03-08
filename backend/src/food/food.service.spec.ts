import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { RedisService } from "src/redis/redis.service";
import { FoodService } from "./food.service";

const MockConfigService = () => ({
  get: jest.fn(),
});

const MockHttpservice = () => ({
  get: jest.fn(),
});

const MockRedisService = () => ({
  getCachedFoodData: jest.fn(),
  addToCacheFoodData: jest.fn(),
});

describe("FoodService", () => {
  let service: FoodService;

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

    service = module.get<FoodService>(FoodService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
