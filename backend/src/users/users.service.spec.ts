import { Test, TestingModule } from "@nestjs/testing";
import { Users } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { MockTypeRepository } from "src/common/test/unit-test.interface";
import { MockRepository } from "src/common/test/unit-test.mock";

describe("UsersService", () => {
  let usersService: UsersService;
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

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(Users));
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe("createUser", () => {
    it("should throw ConflictException when the email already exists", async () => {});
    it("유저 저장에 실패했기때문에 서버에러가 떠야함", async () => {});
    it("유저를 성공적으로 저장", async () => {});
  });

  describe("updateUser", () => {
    it("해당유저아이디로부터 유저정보를 얻지못함", async () => {});
    it("should throw ConflictException when the email already exists", async () => {});
    it("유저를 성공적으로 실패, 서버에러출력", async () => {});
    it("유저를 성공적으로 업데이트", async () => {});
  });

  describe("getReturnValue", () => {
    it("유저정보가 있기때문에 성공 출력", async () => {});
    it("유저정보가 없기때문에 실패 출력", async () => {});
  });

  describe("checkEmailExists", () => {
    it("유저정보 불러오기 실패, 서버에러", async () => {});
    it("유저정보를 성공적으로 불러옴", async () => {});
  });

  describe("findUserById", () => {
    it("유저정보 불러오기 실패, 서버에러", async () => {});
    it("유저정보를 성공적으로 불러옴", async () => {});
  });
});
