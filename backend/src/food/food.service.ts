import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosError } from "axios";
import { catchError, firstValueFrom } from "rxjs";
import { RedisService } from "src/redis/redis.service";
import { OpenFoodApiOutput, OpenFoodFactsDto } from "./dtos/food.dto";
import { FoodOutput } from "./dtos/find.food.dto";

@Injectable()
export class FoodService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService
  ) {}

  /**
   *
   * @param barcode 상품바코드
   * @returns success (boolean), code (number), data or error
   */
  async findFoodByBarcode(barcode: string): Promise<FoodOutput> {
    try {
      // 바코드조회후 있으면 바로 반환
      //  getCachedFoodData => data반환? 바로 리턴
      const isCachedData = await this.redisService.getCachedFoodData(barcode);
      if (isCachedData.product) {
        // console.log(isCachedData.product);
      }
      // return;
      const openFoodApiOutput: OpenFoodApiOutput =
        await this.getFoodDataFromApi(barcode);

      if (openFoodApiOutput.product) {
        await this.redisService.addToCacheFoodData(barcode, openFoodApiOutput);
        return {
          success: true,
          code: openFoodApiOutput.status,
          data: { product: openFoodApiOutput.product },
        };
      } else throw new NotFoundException(openFoodApiOutput.status_verbose);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFoodDataFromApi(barcode: string): Promise<OpenFoodApiOutput> {
    try {
      const url = this.configService.get("FOOD_API_URL");
      const extention = this.configService.get("FOOD_API_EXTENTSION");
      const openFoodFactsDto: OpenFoodApiOutput = await firstValueFrom(
        this.httpService.get(`${url}/${barcode}/${extention}`).pipe(
          catchError((error: AxiosError) => {
            throw new NotFoundException(error);
          })
        )
      ).then((res) => res.data);
      return openFoodFactsDto;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

// async getFoodDataFromApi(barcode: string): Promise<OpenFoodFactsDto> {
//   try {
//     const url = this.configService.get("FOOD_API_URL");
//     const extention = this.configService.get("FOOD_API_EXTENTSION");
//     const response = await this.httpService
//       .get(`${url}/${barcode}/${extention}`)
//       .toPromise();
//     const openFoodFactsDto: OpenFoodFactsDto = response.data;
//     return openFoodFactsDto;
//   } catch (error) {
//     throw new InternalServerErrorException(error);
//   }
// }
