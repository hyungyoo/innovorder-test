import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { FoodApiOkResponse, FoodAuthorizedResponse } from "./food.swagger";

export const CustomFood = (): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    ApiOkResponse({
      description: "Successfully obtained information from Open Food Facts",
      type: FoodApiOkResponse,
    })(target, propertyKey, descriptor);

    ApiUnauthorizedResponse({
      description: "Access token is not allowed",
      type: FoodAuthorizedResponse,
    })(target, propertyKey, descriptor);

    ApiOperation({
      summary: "Get information from Open Food Facts using barcode",
      description:
        "Check if the information for the barcode is present in the Redis database, and if it is not present in the cache, retrieve it from the API and return",
    })(target, propertyKey, descriptor);
  };
};
