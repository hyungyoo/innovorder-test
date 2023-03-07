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
import { OpenFoodFactsDto } from "./dtos/food.dto";
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
  async findFoodByBarcode(barcode: number): Promise<FoodOutput> {
    try {
      // 바코드조회후 있으면 바로 반환
      
      const url = this.configService.get("FOOD_API_URL");
      const extention = this.configService.get("FOOD_API_EXTENTSION");
      const {
        status,
        data: { product, status_verbose },
      }: OpenFoodFactsDto = await firstValueFrom(
        this.httpService.get(`${url}/${barcode}/${extention}`).pipe(
          catchError((error: AxiosError) => {
            throw new NotFoundException(error);
          })
        )
      );
      if (product) {
        // 캐쉬에 저장
        return {
          success: true,
          code: status,
          data: { product: product },
        };
      }
      throw new NotFoundException(status_verbose);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
