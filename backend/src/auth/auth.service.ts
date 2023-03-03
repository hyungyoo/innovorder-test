import {
  HttpStatus,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserWithoutPassword } from "src/users/dtos/create-user.dto";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { AUTH_UNAUTHORIZED } from "./constants/auth.constant";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginOutput } from "./dtos/login.dto";

@Injectable()
export class AuthService {
  private tokens: string[];

  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * 유저 id를 이용하여 접근토큰과 리프레쉬토큰을 발급한후, 리프레쉬토큰을 해쉬화하여
   * 유저정보에 업데이트한다.
   * @param user authUser 데코레이터로 부터 넘겨받은 유저정보
   * @returns
   */
  async login(user: UserWithoutPassword): Promise<LoginOutput> {
    const [access, refresh] = await this.generateTokens(user.id);
    await this.updateHashedRefreshToken(user.id, refresh);
    this.tokens = [access, refresh];
    return {
      success: true,
      code: HttpStatus.OK,
      data: { user },
    };
  }

  getTokens(): string[] {
    return this.tokens;
  }

  logout() {}

  refresh() {}

  /**
   * 유저아이디를 페이로드에 넣고, env로부터 expiration 시간과 시크릿을 받아 접근토큰과 리프레시토큰을 발행
   * @param id 유저 아이디
   * @returns 접근토큰과 리프레쉬토큰
   */
  async generateTokens(id: number) {
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
  }

  /**
   * create를 하면, 유저 엔티티에있는 hashRefreshToken 메서드가 beforeUpdate 데코레이터에 의해서
   * 호출됨. 파라미터로 받은 refreshToken을 해쉬화하여 저장함
   * @param id 유저 id
   * @param refreshToken 해쉬화 되어야할 유저의 리프레쉬토큰
   * @returns
   */
  updateHashedRefreshToken(id: number, refreshToken: string) {
    const user = this.userRepository.create({ id, refreshToken });
    return this.userRepository.save(user);
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
    if (!user) throw new UnauthorizedException(AUTH_UNAUTHORIZED);
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
