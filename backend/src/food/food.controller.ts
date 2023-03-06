import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FoodService } from "./food.service";

@ApiTags("Food")
@Controller(`api/v${process.env.API_VERSION}/food`)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get(":barcode")
  food(@Param("barcode") barcode: number) {
    return this.foodService.findFood(barcode);
  }
}
