import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadType } from "src/auth/interfaces/payload.interface";
import { USER_NOT_FOUND_RESPONSE } from "src/users/constants/user.constants";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

/**
 * PassportStrategy 클래스가 확장됩니다.
 * constructor() 메소드가 호출됩니다. 여기서 Passport 전략이 초기화됩니다. jwtFromRequest 옵션은 HTTP 요청에서 JWT를 추출하는 데 사용되며, secretOrKey는 JWT 서명을 확인하는 데 사용됩니다. 여기에서는 process.env.JWT_ACCESS_SECRET를 사용하여 JWT 서명을 확인합니다.
 * HTTP 요청이 발생하면, Passport가 passport.authenticate() 미들웨어를 호출합니다.
 * passport.authenticate() 미들웨어가 AccessTokenStrategy를 호출합니다.
 * validate() 메소드가 호출됩니다. 이 메소드에서는 JWT 페이로드를 검증하고, 검증이 성공하면 반환합니다.
 * 검증에 실패하면, Passport는 HTTP 응답에 Unauthorized 에러를 반환합니다.
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-access"
) {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate({ id }: PayloadType) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException(USER_NOT_FOUND_RESPONSE);
    return user;
  }
}
