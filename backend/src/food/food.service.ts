import { HttpService } from "@nestjs/axios";
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { RedisService } from "src/redis/redis.service";
import { OpenFoodApiOutput } from "./dtos/food.dto";
import { FoodOutput } from "./dtos/find.food.dto";

@Injectable()
export class FoodService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService
  ) {}

  /**
   * Retrieve data from Open Food Facts API using a barcode while logged in.
   * 1. Receive a barcode as a parameter and search the Redis database using the barcode as the key.
   * 2. If cached data is available, return the cached data.
   * 3. If not, make an API request to Open Food Facts.
   * 4. Store the result in the Redis database.
   * 5. Return the result.
   * @param barcode barcode
   * @returns success (boolean), code (number), data or error
   */
  async findFoodByBarcode(barcode: string): Promise<FoodOutput> {
    try {
      const isCachedData = await this.redisService.getCachedFoodData(barcode);
      if (isCachedData) return this.getReturnValue(isCachedData);

      const openFoodApiOutput: OpenFoodApiOutput =
        await this.getFoodDataFromApi(barcode);
      await this.redisService.addToCacheFoodData(barcode, openFoodApiOutput);
      return this.getReturnValue(openFoodApiOutput);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Define and return the values that the findFoodByBarcode method should return based on the resources received from the API.
   * @param data OpenFoodApiOut
   * @returns
   */
  async getReturnValue(data: OpenFoodApiOutput) {
    if (data.product) {
      return {
        success: true,
        code: HttpStatus.OK,
        data: { product: data.product },
      };
    } else {
      return {
        success: false,
        code: HttpStatus.NOT_FOUND,
        error: { message: data.status_verbose },
      };
    }
  }

  /**
   * Return data from open food facts API using barcode
   * @param barcode barcode
   * @returns data from food data api
   */
  async getFoodDataFromApi(barcode: string): Promise<OpenFoodApiOutput> {
    try {
      const url = this.configService.get("FOOD_API_URL");
      const extention = this.configService.get("FOOD_API_EXTENTSION");
      const openFoodFactsDto: OpenFoodApiOutput = await firstValueFrom(
        this.httpService.get(`${url}/${barcode}/${extention}`).pipe()
      ).then((res) => res.data);
      return openFoodFactsDto;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
