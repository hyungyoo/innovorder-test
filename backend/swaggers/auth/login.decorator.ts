import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LoginApiOkResponse, LoginAuthorizedResponse } from "./auth.swagger";

export const CustomLogin = (): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    ApiOkResponse({
      description: "The user has successfully logged in",
      type: LoginApiOkResponse,
    })(target, propertyKey, descriptor);

    ApiUnauthorizedResponse({
      description: "The user failed to log in because the email or password is incorrect",
      type: LoginAuthorizedResponse,
    })(target, propertyKey, descriptor);

    ApiOperation({
      summary: "Login using email and password",
      description:
        "The user logs in using their email and password, and access and refresh tokens are issued",
    })(target, propertyKey, descriptor);
  };
};
