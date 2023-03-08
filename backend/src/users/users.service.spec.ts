import { Test, TestingModule } from "@nestjs/testing";
import { Users } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import {
  MockTypeRepository,
  createUserInput,
  createUserOutput,
  updateUserInput,
  userFromDB,
} from "src/common/test/unit-test.interface";
import { MockRepository } from "src/common/test/unit-test.mock";
import { InternalServerErrorException } from "@nestjs/common";
import { USER_CONFLICT_RESPONSE } from "./constants/user.constants";

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
    it("should throw ConflictException when the email already exists", async () => {
      jest.spyOn(usersService, "checkEmailExists").mockResolvedValueOnce(true);

      await expect(
        usersService.createUser(createUserInput)
      ).rejects.toThrowError(USER_CONFLICT_RESPONSE);

      expect(usersService.checkEmailExists).toBeCalledTimes(1);
      expect(usersService.checkEmailExists).toBeCalledWith(
        createUserInput.email
      );
    });

    it("should throw an InternalServerErrorException when user save fails in DB", async () => {
      jest.spyOn(usersService, "checkEmailExists").mockResolvedValueOnce(false);
      usersRepository.create.mockReturnValueOnce(createUserInput);
      usersRepository.save.mockRejectedValueOnce(new Error());

      await expect(
        usersService.createUser(createUserInput)
      ).rejects.toThrowError(new InternalServerErrorException(new Error()));

      expect(usersService.checkEmailExists).toBeCalledTimes(1);
      expect(usersService.checkEmailExists).toBeCalledWith(
        createUserInput.email
      );
      expect(usersRepository.create).toBeCalledTimes(1);
      expect(usersRepository.create).toBeCalledWith(createUserInput);
      expect(usersRepository.save).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledWith(createUserInput);
    });

    it("should create user and return createUserOutput", async () => {
      jest.spyOn(usersService, "checkEmailExists").mockResolvedValueOnce(false);
      usersRepository.create.mockReturnValueOnce(createUserInput);
      usersRepository.save.mockResolvedValueOnce(userFromDB);

      const result = await usersService.createUser(createUserInput);

      expect(result).toEqual(createUserOutput);

      expect(usersRepository.create).toBeCalledTimes(1);
      expect(usersRepository.create).toBeCalledWith(createUserInput);
      expect(usersRepository.save).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledWith(createUserInput);
    });
  });

  describe("updateUser", () => {
    it("should failed to obtain user information from the given user ID", async () => {
      jest.spyOn(usersService, "findUserById").mockRejectedValue(undefined);

      await expect(
        usersService.updateUser(expect.any(Number), updateUserInput)
      ).rejects.toThrowError();

      expect(usersService.findUserById).toBeCalledTimes(1);
      expect(usersService.findUserById).toBeCalledWith(expect.any(Number));
    });

    it("should throw a ConflictException when the email already exists", async () => {
      jest
        .spyOn(usersService, "findUserById")
        .mockResolvedValueOnce(userFromDB);
    });
    it("should failed to update the user, server error output", async () => {});
    it("should successfully updated the user", async () => {});
  });

  describe("getReturnValue", () => {
    it.todo("should success output as there is user information");
    it.todo("should failed output as there is no user information");
  });

  describe("checkEmailExists", () => {
    it.todo("should failed to load user information, server error");
    it.todo("should successfully loaded user information");
  });

  describe("findUserById", () => {
    it.todo("should failed to load user information, server error");
    it.todo("should successfully loaded user information");
  });
});
