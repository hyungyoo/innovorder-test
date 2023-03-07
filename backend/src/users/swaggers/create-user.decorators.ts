import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import {
  UserApiConflictResponse,
  UserApiCreatedResponse,
  UserBadRequestResponse,
  UserUnprocessableEntity,
} from "./user.swagger";
import {
  USER_BAD_REQUEST_RESPONSE,
  USER_CONFLICT_RESPONSE,
  USER_CREATED_RESPONSE,
  USER_UNPROCESSABLE_ENTITY,
} from "src/users/constants/user.constants";

export const CustomUserCreate = (): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    ApiCreatedResponse({
      description: USER_CREATED_RESPONSE,
      type: UserApiCreatedResponse,
    })(target, propertyKey, descriptor);

    ApiConflictResponse({
      description: USER_CONFLICT_RESPONSE,
      type: UserApiConflictResponse,
    })(target, propertyKey, descriptor);

    ApiUnprocessableEntityResponse({
      description: USER_UNPROCESSABLE_ENTITY,
      type: UserUnprocessableEntity,
    })(target, propertyKey, descriptor);

    ApiBadRequestResponse({
      description: USER_BAD_REQUEST_RESPONSE,
      type: UserBadRequestResponse,
    })(target, propertyKey, descriptor);

    ApiOperation({
      summary: "Creates a new user",
      description:
        "Create a user by receiving email, last name, first name, and password.",
    })(target, propertyKey, descriptor);
  };
};
