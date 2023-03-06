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

@Injectable()
export class FoodService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService
  ) {}

  async findFood(barcode: number) {
    try {
      const url = this.configService.get("FOOD_API_URL");
      const extention = this.configService.get("FOOD_API_EXTENTSION");
      const {
        status,
        statusText,
        data: { code, product, status: dataStatus, status_verbose },
      } = await firstValueFrom(
        this.httpService.get(`${url}/${barcode}/${extention}`).pipe(
          catchError((error: AxiosError) => {
            throw new NotFoundException(error);
          })
        )
      );

      console.log(status);
      console.log(statusText);
      console.log(code);
      console.log(product);
      console.log(dataStatus);
      console.log(status_verbose);
      console;
      return;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
