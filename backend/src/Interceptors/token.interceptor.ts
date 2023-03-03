import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class JwtHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // route 경로에 따라서 구분지을수있음
    console.log(request.route.path);

    // 조건에 맞을때에만 토큰추가
    return next.handle().pipe(
      tap(() => {
        const accessToken = "hello";
        response.header("Authorization", `Bearer ${accessToken}`);
      })
    );

    return next.handle();
  }
}
