import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import {
  RefreshApiOkResponse,
  RefreshUnAuthorizedResponse,
} from "./auth.swagger";

export const CustomRefresh = (): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    ApiOkResponse({
      description: "The access token has been successfully issued",
      type: RefreshApiOkResponse,
    })(target, propertyKey, descriptor);

    ApiUnauthorizedResponse({
      description: "Refresh token is not allowed",
      type: RefreshUnAuthorizedResponse,
    })(target, propertyKey, descriptor);

    ApiOperation({
      summary: "Refresh access token using a refresh token",
      description:
        "The user obtains a new access token using a refresh token and return refresh token and new access token",
    })(target, propertyKey, descriptor);
  };
};
