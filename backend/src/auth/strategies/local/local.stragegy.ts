import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth/auth.service";
import { AUTH_UNAUTHORIZED } from "src/auth/interfaces/auth.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  /**
   * User login using passport local strategy
   * 1. If the user information is correct, return the user, otherwise return login failure.
   * @param email user email
   * @param password user password
   * @returns user
   */
  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (user) {
        return user;
      } else throw new UnauthorizedException(AUTH_UNAUTHORIZED);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
