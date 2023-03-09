import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";
import { Product } from "src/food/dtos/food.dto";
import {
  LogoutUnAuthorizedResponse,
  RefreshApiOkResponse,
} from "swaggers/auth/auth.swagger";

export class FoodApiOkResponse extends RefreshApiOkResponse {
  @ApiProperty({ description: "Information about food" })
  @IsObject()
  data?: { product: Product; status_verbose: string };
}

export class FoodAuthorizedResponse extends LogoutUnAuthorizedResponse {}
