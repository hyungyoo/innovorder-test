import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, tap } from "rxjs";
import { AuthService } from "src/auth/auth.service";

/**
 * 쿠키는 클라이언트의 브라우저에 저장되는 작은 데이터 조각입니다. 이 쿠키는 서버에서 발급되어 클라이언트에게 전달되며, 클라이언트는 이를 저장하고 필요할 때마다 서버에 전송합니다. 이를 통해 클라이언트의 상태를 유지하고, 로그인 상태 등의 정보를 저장할 수 있습니다.
 * 하지만 쿠키는 클라이언트 측에서 쉽게 접근할 수 있기 때문에 보안상 취약점이 될 수 있습니다. 따라서, 쿠키를 보안성을 강화하기 위해 다음과 같은 옵션을 사용할 수 있습니다.
 * httpOnly: 쿠키를 설정한 도메인의 페이지에서만 접근이 가능하도록 하여, JavaScript나 기타 스크립트 언어에서 쿠키를 조작할 수 없도록 합니다
 * secure: 쿠키를 HTTPS 프로토콜에서만 전송할 수 있도록 하여, 네트워크 상에서 쿠키가 탈취되는 것을 방지합니다
 * sameSite: CSRF(Cross-Site Request Forgery) 공격을 방지하기 위해, 쿠키를 발급한 도메인과 같은 도메인에서만 요청을 보낼 수 있도록 합니다
 * 이렇게 보안성을 강화한 쿠키를 사용하면, 클라이언트와 서버 간의 통신이 안전하게 이루어질 수 있습니다.
 */
@Injectable()
export class JwtHeaderInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    // route 경로에 따라서 구분지을수있음
    console.log(request.route.path);

    return next.handle().pipe(
      tap(() => {
        // access_token은 Authorization 헤더에 담아서 보냅니다.
        const [accessToken, refreshToken] = this.authService.getTokens();
        if (accessToken) {
          response.setHeader("Authorization", `Bearer ${accessToken}`);
        }
        // refresh_token은 쿠키에 담아서 보냅니다.
        if (refreshToken) {
          response.cookie("refresh_token", refreshToken, {
            httpOnly: true, // HTTP 요청에서만 쿠키 접근 가능
            secure: true, // HTTPS에서만 쿠키 전송 가능
            sameSite: "none", // 다른 사이트에서도 요청이 가능하도록 설정
          });
        }
      })
    );
    return next.handle();
  }
}
