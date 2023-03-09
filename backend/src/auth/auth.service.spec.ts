import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Users } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";
import {
  MockConfigService,
  MockJwtService,
  MockRepository,
} from "src/common/test/unit-test.mock";
import { MockTypeRepository } from "src/common/test/unit-test.interface";

describe("AuthService", () => {
  let authService: AuthService;
  let usersRepository: MockTypeRepository<Users>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: MockJwtService(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: MockRepository(),
        },
        {
          provide: ConfigService,
          useValue: MockConfigService(),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(Users));
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe("login", () => {
    it.todo("generateToken 오류시 에러반환");
    it.todo("updateHashedRefreshToken 오류시 에러반환");
    it.todo("성공시 성공 응답 반환");
  });

  describe("logout", () => {
    it.todo("유저정보에서 리프레쉬토큰 제거 오류시 에러 반환");
    it.todo("성공시 성공 응답 반환");
  });

  describe("refresh", () => {
    it.todo("응답반환");
  });

  describe("generateTokens", () => {
    it.todo("signAsync오류시 에러반환");
    it.todo("성공시 토큰반환");
  });

  describe("updateHashedRefreshToken", () => {
    it.todo("타입ORM 오류시 에러반환");
    it.todo("성공시 유저정보 반환");
  });
  
  describe("validateUser", () => {
    it.todo("타입ORM 오류시 에러반환");
    it.todo("비트립트 오류시 에러반환");
    it.todo("성공시 유저정보 반환");
  });
});
