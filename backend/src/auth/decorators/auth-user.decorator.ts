import { ExecutionContext, createParamDecorator } from "@nestjs/common";

/**
 * 컨트롤러에서 request를 받아서 유저를 찾아내는것을 authUser데코레이터에서 수행함
 */
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log(
      "***************authUser custom decorator************************"
    );
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
