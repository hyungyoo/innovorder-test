import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsObject, IsString } from "class-validator";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Product } from "./food.dto";

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
    required: false,
  })
  @IsObject()
  data?: { product: Product };

  @ApiProperty({
    example: { message: "Error message" },
    description: "Error message from http execption filter",
    required: false,
  })
  @IsString({ each: true })
  error?: {
    message: string | string[];
  };
}
