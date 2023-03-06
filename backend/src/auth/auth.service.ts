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
import { AUTH_UNAUTHORIZED } from "./constants/auth.constant";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginOutput } from "./dtos/login.dto";
import { LogoutOutput } from "./dtos/logout.dto";
import { RefreshInput, RefreshOutput } from "./dtos/refresh.dto";

@Injectable()
export class AuthService {
  private _tokens: [string, string];

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
    this._tokens = [access, refresh];
    return {
      success: true,
      code: HttpStatus.OK,
      data: { user },
    };
  }

  /**
   * 로그아웃에서는 아무것도안줘도된다
   * 접근토큰은 남아있기때문에, redis의 블랙리스트에등록.
   * @param user
   */
  async logout({ id }: UserWithoutPassword): Promise<LogoutOutput> {
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
  }

  /**
   * 유저로 부터 받은 리프레쉬토큰으로 유저정보를 파악, 해쉬화된 유저의 리프레쉬토큰과 비교후
   * 정보가 맞다면, 유저에게 기존 리프레쉬토큰과 새로운 접근토큰을 발급.
   * @param id 유저 아이디 @param refreshToken 유저 리프레쉬토큰
   * @returns success: true, 상태코드 : ok, 헤더의 authorization에 새로운 토큰값
   */
  async refresh({ id, refreshToken }: RefreshInput): Promise<RefreshOutput> {
    const [access] = await this.generateTokens(id);
    this._tokens = [access, refreshToken];
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
   * 유저아이디를 페이로드에 넣고, env로부터 expiration 시간과 시크릿을 받아 접근토큰과 리프레시토큰을 발행
   * @param id 유저 아이디
   * @returns 접근토큰과 리프레쉬토큰
   */
  generateTokens(id: number) {
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

  /**
   * 유저의 id를 받아, 새로운 접근토큰을 만을 발급하여 클라이언트의 헤더에 추가.
   * jwt에서의 페이로드로 로그인을 한 후에, 해당 id로 새로운 접근토큰을 생성
   * @param id 유저 id
   */
  async generateNewAccessToken(id: number) {
    const [access] = await this.generateTokens(id);
    this.tokens = [access, undefined];
  }
}
