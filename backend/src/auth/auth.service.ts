import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserWithoutPassword } from "src/users/dtos/create-user.dto";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { AUTH_UNAUTHORIZED } from "./interfaces/auth.interface";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginOutput } from "./dtos/login.dto";
import { LogoutOutput } from "./dtos/logout.dto";
import { RefreshOutput } from "./dtos/refresh.dto";

@Injectable()
export class AuthService {
  /**
   * Tokens to be used in JWT interceptor
   */
  private _tokens: [string, string];

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Generate and return tokens using the user ID.
   * 1. Generate access and refresh tokens using the user ID.
   * 2. Hash the refresh token and update the user information.
   * 3. Add tokens to the header using the interceptor.
   * @param user user
   * @returns body (user), header (access token, refresh token)
   */
  async login(user: UserWithoutPassword): Promise<LoginOutput> {
    try {
      const [access, refresh] = await this.generateTokens(user.id);
      await this.updateHashedRefreshToken(user.id, refresh);
      this._tokens = [access, refresh];
      return {
        success: true,
        code: HttpStatus.OK,
        data: { user },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Delete the user's refresh token
   * 1. Access the user information and initialize the refresh token to null.
   * @param user user
   */
  async logout({ id }: UserWithoutPassword): Promise<LogoutOutput> {
    try {
      const savedUser = await this.userRepository.save(
        this.userRepository.create({ id, refreshToken: null })
      );
      if (!savedUser) {
        throw new InternalServerErrorException(
          "데이터를 저장하는데 실패하였습니다"
        );
      }
      return {
        success: true,
        code: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * return success and code
   * @returns header (refresh token, access token) body (success, code)
   */
  async refresh(): Promise<RefreshOutput> {
    return {
      success: true,
      code: HttpStatus.OK,
    };
  }

  /**
   * setter
   */
  public set tokens(value: [string, string]) {
    this._tokens = value;
  }

  /**
   * getter
   */
  public get tokens(): [string, string] {
    if (!this._tokens) return [undefined, undefined];
    return this._tokens;
  }

  /**
   * Generate access token and refresh token using user id.
   * 1. Input user id for payload of tokens.
   * 2. Receive expiration time and secret from config service and issue access token and refresh token.
   * @param id user id
   * @returns [access_token, refresh_token]
   */
  generateTokens(id: number) {
    try {
      return Promise.all([
        this.jwtService.signAsync(
          { id },
          {
            expiresIn: this.configService.get("JWT_ACCESS_EXPIRATION_TIME"),
            secret: this.configService.get("JWT_ACCESS_SECRET"),
          }
        ),
        this.jwtService.signAsync(
          { id },
          {
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRATION_TIME"),
            secret: this.configService.get("JWT_REFRESH_SECRET"),
          }
        ),
      ]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Update user's refresh token in the user's data.
   * 1. The hashRefreshToken method in the user entity is called by @beforeUpdate.
   * 2. The received refreshToken parameter is hashed and stored.
   * @param id user id
   * @param refreshToken refresh token
   * @returns updated user
   */
  updateHashedRefreshToken(id: number, refreshToken: string) {
    try {
      const user = this.userRepository.create({ id, refreshToken });
      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Call local strategy that receives email and password and returns user information.
   * 1. Retrieve user information corresponding to the user's email from the database.
   * 2. If the password matches as well, return user information except for the password
   * @param email user email
   * @param password user password
   * @returns user or null
   */
  async validateUser(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: [
          "id",
          "email",
          "password",
          "firstName",
          "lastName",
          "createdAt",
          "updatedAt",
        ],
      });
      if (!user) throw new UnauthorizedException(AUTH_UNAUTHORIZED);
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
