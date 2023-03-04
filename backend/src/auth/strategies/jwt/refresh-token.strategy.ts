import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadType } from "src/auth/interfaces/payload.interface";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { RefreshInput } from "src/auth/dtos/refresh.dto";

function refreshJwtFromReq(request: Request) {
  if (request && request.headers && request.headers["set-cookie"])
    return request.headers["set-cookie"][0]?.split(";")[0]?.split("=")[1];
  return null;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return refreshJwtFromReq(request);
        },
      ]),
      passReqToCallback: true,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  /**
   * 이후에 리프레쉬토큰은 잠시 비교만하는건지?
   * 아 비교맞음. comparer ok!
   * 비교까지되면 유저에 헤더로부터 받은 리프레쉬토큰을 넣어서 리턴
   * @param _ request : 해쉬화된 토큰값을 얻어올수있음
   * @param param1 payload, user id
   * @returns user정보를 요청에추가
   */
  async validate(req: Request, { id }: PayloadType) {
    const tokenFromHeader = refreshJwtFromReq(req);
    const user: RefreshInput = await this.userRepository.findOne({
      where: { id },
      select: ["id", "refreshToken"],
    });
    if (!(tokenFromHeader && user.refreshToken))
      throw new UnauthorizedException(
        "다시 로그인을 해주세요. 로그아웃을하였던가 토큰이없어"
      );
    const isMatchRefreshToken = await bcrypt.compareSync(
      tokenFromHeader,
      user.refreshToken || null
    );
    if (!isMatchRefreshToken)
      throw new UnauthorizedException("토큰이 달라서 권한없음");
    user.refreshToken = tokenFromHeader;
    return user;
  }
}
