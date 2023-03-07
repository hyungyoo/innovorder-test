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

@ApiTags("Food")
@Controller(`api/v${process.env.API_VERSION}/food`)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Get(":barcode")
  food(@Param("barcode") barcode: number) {
    return this.foodService.findFoodByBarcode(barcode.toString());
  }
}
