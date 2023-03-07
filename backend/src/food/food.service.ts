import { HttpService } from "@nestjs/axios";
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
   * 바코드를 파라미터로 받아, 바코드를 키로서 레디스 데이터베이스에 검색후
   * 캐쉬데이터가 남아있다면, 캐쉬를 반환.
   * 아니라면 open food facts에 api요청을하여, 결과값을 데이터베이스에 저장한후
   * 결과값 반환
   * @param barcode 상품바코드
   * @returns success (boolean), code (number), data or error
   */
  async findFoodByBarcode(barcode: string): Promise<FoodOutput> {
    try {
      const isCachedData = await this.redisService.getCachedFoodData(barcode);
      if (isCachedData) {
        if (isCachedData.product) {
          console.log("in cache data");
          return {
            success: true,
            code: isCachedData.status,
            data: { product: isCachedData.product },
          };
        } else {
          console.log("in cache data");
          throw new NotFoundException(isCachedData.status_verbose);
        }
      }
      const openFoodApiOutput: OpenFoodApiOutput =
        await this.getFoodDataFromApi(barcode);
      if (openFoodApiOutput?.product) {
        console.log("in new data");
        await this.redisService.addToCacheFoodData(barcode, openFoodApiOutput);
        return {
          success: true,
          code: openFoodApiOutput.status,
          data: { product: openFoodApiOutput.product },
        };
      } else {
        console.log("in new data");
        throw new NotFoundException(openFoodApiOutput.status_verbose);
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

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
