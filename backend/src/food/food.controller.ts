import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FoodService } from "./food.service";

@ApiTags("food")
@Controller(`api/v${process.env.API_VERSION}/food`)
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get(":barcode")
  food() {}
}
