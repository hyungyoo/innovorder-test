import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserWithoutPassword } from "src/users/dtos/create-user.dto";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { AUTH_UNAUTHORIZED } from "./constants/auth.constant";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateTokens(id: number) {
    const accessToken = await this.jwtService.signAsync(
      { id },
      {
        expiresIn: this.configService.get("JWT_ACCESS_EXPIRATION_TIME"),
        secret: this.configService.get("JWT_ACCESS_SECRET"),
      }
    );
    const refreshToken = await this.jwtService.signAsync(
      { id },
      {
        expiresIn: this.configService.get("JWT_REFRESH_EXPIRATION_TIME"),
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      }
    );
    return [accessToken, refreshToken];
  }

  async updateHashedRefreshToken(id: number, refreshToken: string) {
    const user = this.userRepository.create({ id, refreshToken });
    const newUser = await this.userRepository.save(user);
    console.log(newUser.refreshToken, " : is new user refresh token");
  }

  async login(user: UserWithoutPassword) {
    console.log(user);
    const [accessToken, refreshToken] = await this.generateTokens(user.id);
    await this.updateHashedRefreshToken(user.id, refreshToken);
    console.log(refreshToken, " is user refresh token");
  }

  /**
   * 로컬 strategy에서 호출되는 메서드로서 이메일과비밀번호를 받아 유저정보를 반환함
   * @param email stragegy의 파라미터중에 username 필드를 변경함
   * @param password 유저가 보내는 비밀번호
   * @returns 유저정보 또는 Null값
   */
  async validateUser(email: string, password: string) {
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
    if (!user) throw new UserWithoutPassword(AUTH_UNAUTHORIZED);
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  logout() {}

  refresh() {}
}
