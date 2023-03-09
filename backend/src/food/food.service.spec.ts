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
import {
  barcode,
  foodData,
  foodFailOutput,
  foodSuccessOutput,
  openFoodApiDto,
  openfoodApiFailOutput,
  openfoodApiOutput,
} from "src/common/test/unit-test.interface";
import { InternalServerErrorException } from "@nestjs/common";

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
    expect(configService).toBeDefined();
    expect(httpService).toBeDefined();
    expect(redisService).toBeDefined();
  });

  describe("findFoodByBarcode", () => {
    it("should return an error if there is an error", async () => {
      jest
        .spyOn(redisService, "getCachedFoodData")
        .mockRejectedValueOnce(new Error());

      await expect(foodService.findFoodByBarcode(barcode)).rejects.toThrowError(
        InternalServerErrorException
      );

      expect(redisService.getCachedFoodData).toBeCalledTimes(1);
      expect(redisService.getCachedFoodData).toBeCalledWith(barcode);
    });

    it("should return data if there is an data in redis cache", async () => {
      jest
        .spyOn(redisService, "getCachedFoodData")
        .mockResolvedValueOnce(foodData);
      jest.spyOn(redisService, "addToCacheFoodData").mockResolvedValueOnce();

      const result = await foodService.findFoodByBarcode(barcode);
      expect(result).toStrictEqual(foodSuccessOutput);

      expect(redisService.getCachedFoodData).toBeCalledTimes(1);
      expect(redisService.getCachedFoodData).toBeCalledWith(barcode);
      expect(redisService.addToCacheFoodData).toBeCalledTimes(0);
    });

    it("should reuturn data form API request if there is no data in the Redis cache", async () => {
      jest
        .spyOn(redisService, "getCachedFoodData")
        .mockResolvedValueOnce(undefined);
      jest.spyOn(redisService, "addToCacheFoodData").mockResolvedValueOnce();
      jest
        .spyOn(foodService, "getFoodDataFromApi")
        .mockResolvedValueOnce(openfoodApiOutput);

      const result = await foodService.findFoodByBarcode(barcode);
      expect(result).toStrictEqual(foodSuccessOutput);

      expect(redisService.getCachedFoodData).toBeCalledTimes(1);
      expect(redisService.getCachedFoodData).toBeCalledWith(barcode);
      expect(redisService.addToCacheFoodData).toBeCalledTimes(1);
      expect(redisService.addToCacheFoodData).toBeCalledWith(
        barcode,
        openfoodApiOutput
      );
    });
  });

  describe("getReturnValue", () => {
    it("should return a successful response when product is available", () => {
      const result = foodService.getReturnValue(openfoodApiOutput);
      expect(result).toEqual(foodSuccessOutput);
    });

    it("should return fail response when product is not available", () => {
      const result = foodService.getReturnValue(openfoodApiFailOutput);
      expect(result).toEqual(foodFailOutput);
    });
  });

  describe("getFoodDataFromApi", () => {
    it("should fail if axios call returns server error", async () => {
      jest
        .spyOn(httpService.axiosRef, "get")
        .mockRejectedValueOnce(new Error());

      await expect(
        foodService.getFoodDataFromApi(barcode)
      ).rejects.toThrowError();

      expect(httpService.axiosRef.get).toBeCalledTimes(1);
      expect(httpService.axiosRef.get).toBeCalledWith(expect.any(String));
      expect(configService.get).toBeCalledTimes(2);
    });

    it("should return data using Axios", async () => {
      jest
        .spyOn(httpService.axiosRef, "get")
        .mockResolvedValueOnce(openFoodApiDto);

      const result = await foodService.getFoodDataFromApi(barcode);
      expect(result).toMatchObject(openfoodApiOutput);

      expect(httpService.axiosRef.get).toBeCalledTimes(1);
      expect(httpService.axiosRef.get).toBeCalledWith(expect.any(String));
      expect(configService.get).toBeCalledTimes(2);
    });
  });
});
