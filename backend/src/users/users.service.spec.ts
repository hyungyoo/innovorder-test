import { Test, TestingModule } from "@nestjs/testing";
import { Users } from "./entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import {
  MockTypeRepository,
  createUserInput,
  createUserOutput,
  updateUserInput,
  updateUserInputDiffEmail,
  updateUserOutputFail,
  updateUserOutputSuccess,
  updatedUser,
  userForRespository,
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
      jest
        .spyOn(usersService, "findUserById")
        .mockResolvedValueOnce(userFromDB as Users);
      jest.spyOn(usersService, "checkEmailExists").mockResolvedValue(true);
      jest
        .spyOn(usersService, "getReturnValue")
        .mockReturnValue(updateUserOutputFail);

      const result = await usersService.updateUser(
        expect.any(Number),
        updateUserInputDiffEmail
      );
      expect(result).toEqual(updateUserOutputFail);

      expect(usersService.findUserById).toBeCalledTimes(1);
      expect(usersService.findUserById).toBeCalledWith(expect.any(Number));
      expect(usersService.checkEmailExists).toBeCalledTimes(1);
      expect(usersService.checkEmailExists).toBeCalledWith(
        updateUserInputDiffEmail.email
      );
      expect(usersService.getReturnValue).toBeCalledTimes(1);
      expect(usersService.getReturnValue).toBeCalledWith();
    });

    it("should update user if email exist but it is the same email as user", async () => {
      jest
        .spyOn(usersService, "findUserById")
        .mockResolvedValueOnce(userFromDB as Users);
      jest.spyOn(usersService, "checkEmailExists").mockResolvedValue(true);
      usersRepository.create.mockReturnValueOnce(userForRespository);
      usersRepository.save.mockResolvedValueOnce(userForRespository);
      jest
        .spyOn(usersService, "getReturnValue")
        .mockReturnValue(updateUserOutputSuccess);

      const result = await usersService.updateUser(
        expect.any(Number),
        updateUserInput
      );
      expect(result).toEqual(updateUserOutputSuccess);

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
    it("should success output as there is user information", () => {
      const result = usersService.getReturnValue();
      expect(result).toEqual(updateUserOutputFail);
    });
    it("should failed output as there is no user information", () => {
      const result = usersService.getReturnValue(updatedUser);
      expect(result).toEqual(updateUserOutputSuccess);
    });
  });

  describe("checkEmailExists", () => {
    it("should failed to load user information, server error", async () => {
      usersRepository.findOne.mockRejectedValueOnce(new Error());

      await expect(
        usersService.checkEmailExists(userFromDB.email)
      ).rejects.toThrowError();

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: `${userFromDB.email}` },
      });
    });

    it("should successfully loaded user information", async () => {
      usersRepository.findOne.mockResolvedValueOnce(userFromDB);

      const result = await usersService.checkEmailExists(userFromDB.email);
      expect(result).toBeTruthy();

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: `${userFromDB.email}` },
      });
    });
  });

  describe("findUserById", () => {
    it("should failed to load user information, server error", async () => {
      usersRepository.findOne.mockRejectedValueOnce(new Error());

      await expect(usersService.findUserById(1)).rejects.toThrowError();

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should successfully loaded user information", async () => {
      usersRepository.findOne.mockResolvedValue(userFromDB);

      const result = await usersService.findUserById(1);
      expect(result).toEqual(userFromDB);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
