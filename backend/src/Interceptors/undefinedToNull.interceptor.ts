import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * To indicate the absence of a value in JSON data, convert undefined to null.
 */
@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    console.log(
      "*****************INTERCEPTOR BEFORE CONTROLLER*****************"
    );
    return next.handle().pipe(
      map((data) => {
        console.log(
          "*****************INTERCEPTOR AFTER CONTROLLER*****************"
        );
        return data === undefined ? null : data;
      })
    );
  }
}
