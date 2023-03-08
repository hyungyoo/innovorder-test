import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { Users } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";

const MockRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

type MockTypeRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe("UsersService", () => {
  let service: UsersService;
  let usersRepository: MockTypeRepository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: MockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
