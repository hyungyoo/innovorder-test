import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import {
  UserApiConflictResponse,
  UserApiOkResponse,
  UserBadRequestResponse,
  UserNotFoundResponse,
  UserUnprocessableEntity,
} from "./user.swagger";
import {
  USER_BAD_REQUEST_RESPONSE,
  USER_CONFLICT_RESPONSE,
  USER_NOT_FOUND_RESPONSE,
  USER_OK_RESPONSE,
  USER_UNPROCESSABLE_ENTITY,
} from "src/users/constants/user.constants";

export const CustomUserUpdate = (): MethodDecorator => {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    ApiOkResponse({
      description: USER_OK_RESPONSE,
      type: UserApiOkResponse,
    })(target, propertyKey, descriptor);

    ApiConflictResponse({
      description: USER_CONFLICT_RESPONSE,
      type: UserApiConflictResponse,
    })(target, propertyKey, descriptor);

    ApiNotFoundResponse({
      description: USER_NOT_FOUND_RESPONSE,
      type: UserNotFoundResponse,
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
      summary:
        "Update user information using user ID from access token 다시번역!",
      description:
        "Find the user corresponding to the user ID and update the user",
    })(target, propertyKey, descriptor);
  };
};
