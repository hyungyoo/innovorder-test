import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import {
  UserApiConflictResponse,
  UserApiOkResponse,
  UserNotFoundResponse,
  UserUnprocessableEntity,
} from "../swagger/user.swagger";
import {
  USER_CONFLICT_RESPONSE,
  USER_NOT_FOUND,
  USER_OK_RESPONSE,
  USER_UNPROCESSABLE_ENTITY,
} from "src/common/constants/user.constants";

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
      description: USER_NOT_FOUND,
      type: UserNotFoundResponse,
    })(target, propertyKey, descriptor);

    ApiUnprocessableEntityResponse({
      description: USER_UNPROCESSABLE_ENTITY,
      type: UserUnprocessableEntity,
    })(target, propertyKey, descriptor);

    ApiParam({ name: "id", description: "user's id" })(
      target,
      propertyKey,
      descriptor
    );

    ApiOperation({
      summary: "Creates a new user",
      description:
        "Find the user corresponding to the user ID and update the user",
    })(target, propertyKey, descriptor);
  };
};
