import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { RefreshInput } from "src/auth/dtos/refresh.dto";
import {
  PayloadType,
  REFRESH_TOKEN_NOT_ALLOWED,
} from "src/auth/interfaces/auth.interface";

/**
 * Function that extracts the refresh token from header
 * 1. Accesses the cookie in the request header and splits it by ";"
 * 2. Extracts only the token part from the element that starts with "refresh_token=" and returns it.
 * @param request request
 * @returns refresh token
 */
function refreshJwtFromReq(request: Request) {
  if (request && request.headers && request.headers["cookie"])
    return request.headers["cookie"]
      ?.split(";")
      ?.find((cookie) => cookie.startsWith("refresh_token="))
      ?.split("=")[1];
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
   * If the refresh token matches the hashed refresh token of the user, return the user.
   * 1. Extract the user from the cookie section of the request.
   * 2. Compare the hashed refresh token from the extracted user with the refresh token from the request.
   * 3. If they match, add the refresh token from the request to the user and return the user.
   * @param req request
   * @param payload payload of refresh token
   * @returns user with refresh token
   */
  async validate(req: Request, { id }: PayloadType) {
    try {
      const refreshtokenFromHeader = refreshJwtFromReq(req);
      const user: RefreshInput = await this.userRepository.findOne({
        where: { id },
        select: ["id", "refreshToken"],
      });
      if (!(refreshtokenFromHeader && user.refreshToken))
        throw new UnauthorizedException(REFRESH_TOKEN_NOT_ALLOWED);

      const isMatchRefreshToken = await bcrypt.compareSync(
        refreshtokenFromHeader,
        user.refreshToken || null
      );
      if (!isMatchRefreshToken)
        throw new UnauthorizedException(REFRESH_TOKEN_NOT_ALLOWED);
      user.refreshToken = refreshtokenFromHeader;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
