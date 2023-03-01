import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import {
  UserApiConflictResponse,
  UserApiOkResponse,
  UserNotFoundResponse,
} from "../swagger/user.swagger";
import {
  USER_CONFLICT_RESPONSE,
  USER_NOT_FOUND,
  USER_OK_RESPONSE,
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
