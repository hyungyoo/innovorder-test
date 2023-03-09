import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FoodService } from "./food.service";
import { AccessTokenGuard } from "src/auth/guards/jwt-access.guard";
import { JwtHeaderInterceptor } from "src/Interceptors/jwt.interceptor";
import { CustomFood } from "swaggers/food/food.decorator";

@ApiTags("Food")
@Controller(`api/v${process.env.API_VERSION}/food`)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  /**
   * Retrieve information from Open Food Facts using a barcode while logged in.
   * 1. Authorize access to the access token and handle token renewal and blacklist registration through AccessTokenGuard and JwtHeaderInterceptor.
   * Return a response based on the barcode.
   * @param barcode
   * @returns header (access token), body (food info)
   */
  @CustomFood()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Get(":barcode")
  food(@Param("barcode") barcode: number) {
    return this.foodService.findFoodByBarcode(barcode.toString());
  }
}
