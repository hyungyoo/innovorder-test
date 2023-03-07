import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadType } from "src/auth/interfaces/auth.interface";
import { USER_NOT_FOUND_RESPONSE } from "src/users/constants/user.constants";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

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

  /**
   * Queries the user ID and returns it if the user exists
   * @param payload Payload containing the user ID
   * @returns user
   */
  async validate({ id }: PayloadType) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new UnauthorizedException(USER_NOT_FOUND_RESPONSE);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
