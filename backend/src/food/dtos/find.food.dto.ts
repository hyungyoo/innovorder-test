import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject } from "class-validator";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Product } from "./food.dto";

/**
 * 음식결과값을 위한 dto
 */
export class FoodOutput extends CoreOutput {
  @ApiProperty({
    example: HttpStatus.OK,
    description: "Status code value",
    required: true,
  })
  @IsNumber()
  code: number;

  @ApiProperty({
    description: "food data",
    required: true,
  })
  @IsObject()
  data: { product: Product };
}
