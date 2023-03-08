import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Users } from "src/users/entities/user.entity";
import { AuthService } from "./auth.service";

const MockConfigService = () => ({
  get: jest.fn(),
});

const MockJwtService = () => ({
  signAsync: jest.fn(),
});

const MockRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

type MockTypeRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe("AuthService", () => {
  let service: AuthService;

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

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
