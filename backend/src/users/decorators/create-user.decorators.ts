import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from "@nestjs/swagger";
import {
  UserApiConflictResponse,
  UserApiCreatedResponse,
} from "../swagger/user.swagger";
import {
  USER_CONFLICT_RESPONSE,
  USER_CREATED_RESPONSE,
} from "src/common/constants/user.constants";

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
    ApiOperation({
      summary: "Creates a new user",
      description:
        "Create a user by receiving email, last name, first name, and password.",
    })(target, propertyKey, descriptor);
  };
};
