import { Test, TestingModule } from "@nestjs/testing";
import { Users } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import {
  MockTypeRepository,
  createUserInput,
  createUserOutput,
  userFromDB,
} from "src/common/test/unit-test.interface";
import { MockRepository } from "src/common/test/unit-test.mock";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
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
      jest.spyOn(usersService, "findUserById").mockResolvedValue(undefined);

      await expect(
        usersService.updateUser(expect.any(Number), { email: "test@email.com" })
      ).rejects.toThrowError();

      expect(usersService.findUserById).toBeCalledTimes(1);
      expect(usersService.findUserById).toBeCalledWith(expect.any(Number));
    });

    it("should throw a ConflictException when the email already exists and not same email as user", async () => {
      const updateUserInput = {
        email: "test@email.com",
        password: "12345",
      };
      const updateUserOutput = {
        success: true,
        code: HttpStatus.CONFLICT,
        error: { message: USER_CONFLICT_RESPONSE },
      };

      jest
        .spyOn(usersService, "findUserById")
        .mockResolvedValueOnce(userFromDB as Users);
      jest.spyOn(usersService, "checkEmailExists").mockResolvedValue(true);
      jest
        .spyOn(usersService, "getReturnValue")
        .mockReturnValue(updateUserOutput);

      const result = await usersService.updateUser(
        expect.any(Number),
        updateUserInput
      );
      expect(result).toEqual(updateUserOutput);

      expect(usersService.findUserById).toBeCalledTimes(1);
      expect(usersService.findUserById).toBeCalledWith(expect.any(Number));
      expect(usersService.checkEmailExists).toBeCalledTimes(1);
      expect(usersService.checkEmailExists).toBeCalledWith(
        updateUserInput.email
      );
      expect(usersService.getReturnValue).toBeCalledTimes(1);
      expect(usersService.getReturnValue).toBeCalledWith();
    });

    it("should update user if email exist but it is the same email as user", async () => {
      const updateUserInput = {
        email: `${userFromDB.email}`,
        password: "12345",
      };
      const userForRespository: typeof userFromDB = {
        ...userFromDB,
        ...updateUserInput,
      };
      const { password, refreshToken, ...updatedUser } = userForRespository;
      const updateUserOutput = {
        success: true,
        code: HttpStatus.OK,
        data: { user: updatedUser },
      };

      jest
        .spyOn(usersService, "findUserById")
        .mockResolvedValueOnce(userFromDB as Users);
      jest.spyOn(usersService, "checkEmailExists").mockResolvedValue(true);
      usersRepository.create.mockReturnValueOnce(userForRespository);
      usersRepository.save.mockResolvedValueOnce(userForRespository);
      jest
        .spyOn(usersService, "getReturnValue")
        .mockReturnValue(updateUserOutput);

      const result = await usersService.updateUser(
        expect.any(Number),
        updateUserInput
      );
      expect(result).toEqual(updateUserOutput);

      expect(usersService.findUserById).toBeCalledTimes(1);
      expect(usersService.findUserById).toBeCalledWith(expect.any(Number));
      expect(usersService.checkEmailExists).toBeCalledTimes(1);
      expect(usersService.checkEmailExists).toBeCalledWith(
        updateUserInput.email
      );
      expect(usersService.getReturnValue).toBeCalledTimes(1);
      expect(usersService.getReturnValue).toBeCalledWith(updatedUser);
    });
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
