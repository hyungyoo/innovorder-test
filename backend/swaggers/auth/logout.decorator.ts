import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import {
  LogoutUnAuthorizedResponse,
  LogoutNoContentResponse,
} from "./auth.swagger";

export const CustomLogout = (): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    ApiNoContentResponse({
      description: "Logout is functioning properly",
      type: LogoutNoContentResponse,
    })(target, propertyKey, descriptor);

    ApiUnauthorizedResponse({
      description: "Access token is not allowed",
      type: LogoutUnAuthorizedResponse,
    })(target, propertyKey, descriptor);

    ApiOperation({
      summary: "User logout using refresh token",
      description:
        "If the user successfully accesses the logout resource using the access token, the refresh token is deleted, and the access token is stored in the Redis blacklist",
    })(target, propertyKey, descriptor);
  };
};
