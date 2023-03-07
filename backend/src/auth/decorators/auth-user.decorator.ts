import {
  ExecutionContext,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from "@nestjs/common";
import { AUTH_USER_NOT_FOUND } from "../interfaces/auth.interface";

/**
 * This decorator receives a contenxt and finds the user and return it.
 * 1. It goes through guards and interceptors to only return the user added to the request.
 * 2. This ensures that the controller does not directly access the request using @req.
 */
export const AuthUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;
      if (!user) throw new UnauthorizedException(AUTH_USER_NOT_FOUND);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
);
