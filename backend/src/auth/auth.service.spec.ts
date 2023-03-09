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
} from "test/interface/unit-test.mock";
import {
  MockTypeRepository,
  accessToken,
  emailInput,
  failEmail,
  idAndRefreshToken,
  passwordInput,
  refreshToken,
  userFromDB,
  userLogoutOutPut,
  userLoingOutput,
  userRefreshOutput,
  validateUserInput,
} from "test/interface/unit-test.interface";
import { InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

jest.mock("bcryptjs");

describe("AuthService", () => {
  let authService: AuthService;
  let usersRepository: MockTypeRepository<Users>;
  let configService: ConfigService;
  let jwtService: JwtService;

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
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(authService).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(configService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe("login", () => {
    const { password, ...user } = userFromDB;

    it("should return an error if there is an error with generateToken", async () => {
      jest
        .spyOn(authService, "generateTokens")
        .mockRejectedValueOnce(new Error());
      jest.spyOn(authService, "updateHashedRefreshToken");

      await expect(authService.login(user)).rejects.toThrowError(
        InternalServerErrorException
      );

      expect(authService.generateTokens).toBeCalledTimes(1);
      expect(authService.generateTokens).toBeCalledWith(user.id);
      expect(authService.updateHashedRefreshToken).toBeCalledTimes(0);
    });

    it("should return an error if there is an error with updateHashedRefreshToken", async () => {
      jest
        .spyOn(authService, "generateTokens")
        .mockResolvedValueOnce([accessToken, user.refreshToken]);
      jest
        .spyOn(authService, "updateHashedRefreshToken")
        .mockRejectedValueOnce(new Error());

      await expect(authService.login(user)).rejects.toThrowError(
        InternalServerErrorException
      );

      expect(authService.generateTokens).toBeCalledTimes(1);
      expect(authService.generateTokens).toBeCalledWith(user.id);
      expect(authService.updateHashedRefreshToken).toBeCalledTimes(1);
      expect(authService.updateHashedRefreshToken).toBeCalledWith(
        user.id,
        user.refreshToken
      );
    });

    it("should successfuly login", async () => {
      jest
        .spyOn(authService, "generateTokens")
        .mockResolvedValueOnce([accessToken, user.refreshToken]);
      jest.spyOn(authService, "updateHashedRefreshToken");

      const result = await authService.login(user);
      expect(result).toEqual(userLoingOutput(user));

      expect(authService.generateTokens).toBeCalledTimes(1);
      expect(authService.generateTokens).toBeCalledWith(user.id);
      expect(authService.updateHashedRefreshToken).toBeCalledTimes(1);
      expect(authService.updateHashedRefreshToken).toBeCalledWith(
        user.id,
        user.refreshToken
      );
    });
  });

  describe("logout", () => {
    const { refreshToken, ...userWithToken } = userFromDB;
    it("should return error if an error removing the refresh token from TypeORM", async () => {
      usersRepository.create.mockReturnValueOnce({
        id: userFromDB.id,
        refreshToken: null,
      });
      usersRepository.save.mockRejectedValueOnce(new Error());

      await expect(authService.logout(userWithToken)).rejects.toThrowError(
        InternalServerErrorException
      );

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith({
        id: userFromDB.id,
        refreshToken: null,
      });
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith({
        id: userFromDB.id,
        refreshToken: null,
      });
    });

    it("should return error if there is no user", async () => {
      usersRepository.create.mockReturnValueOnce({
        id: userFromDB.id,
        refreshToken: null,
      });
      usersRepository.save.mockResolvedValueOnce(undefined);

      await expect(authService.logout(userWithToken)).rejects.toThrowError(
        InternalServerErrorException
      );

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith({
        id: userFromDB.id,
        refreshToken: null,
      });
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith({
        id: userFromDB.id,
        refreshToken: null,
      });
    });

    it("should successfuly return logout", async () => {
      usersRepository.create.mockReturnValueOnce({
        id: userFromDB.id,
        refreshToken: null,
      });
      usersRepository.save.mockResolvedValueOnce({
        id: userFromDB.id,
        refreshToken: null,
      });

      const result = await authService.logout(userWithToken);
      expect(result).toEqual(userLogoutOutPut);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith({
        id: userFromDB.id,
        refreshToken: null,
      });
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith({
        id: userFromDB.id,
        refreshToken: null,
      });
    });
  });

  describe("refresh", () => {
    it("should successfuly refresh access token", () => {
      const result = authService.refresh();
      expect(result).toEqual(userRefreshOutput);
    });
  });

  describe("getter and setter", () => {
    it("should setter work", () => {
      authService.tokens = [accessToken, refreshToken];
      expect(authService.tokens).toEqual([accessToken, refreshToken]);
    });

    it("should getter work", () => {
      authService.tokens = undefined;
      expect(authService.tokens).toEqual([undefined, undefined]);
    });
  });

  describe("generateTokens", () => {
    it("should return an error if there is an error with signAsync", async () => {
      jest.spyOn(jwtService, "signAsync").mockRejectedValueOnce(new Error());

      await expect(
        authService.generateTokens(userFromDB.id)
      ).rejects.toThrowError(new Error());

      expect(configService.get).toBeCalledTimes(4);
    });

    it("should successfuly return access token and refresh token", async () => {
      jest.spyOn(configService, "get").mockReturnValue(expect.any(String));
      jest.spyOn(jwtService, "signAsync").mockResolvedValueOnce(accessToken);
      jest.spyOn(jwtService, "signAsync").mockResolvedValueOnce(refreshToken);

      const result = await authService.generateTokens(userFromDB.id);
      expect(result).toEqual([accessToken, refreshToken]);

      expect(configService.get).toBeCalledTimes(4);
      expect(configService.get).toBeCalledWith(
        "JWT_ACCESS_EXPIRATION_TIME" || "JWT_ACCESS_SECRET"
      );
      expect(jwtService.signAsync).toBeCalledTimes(2);
      expect(jwtService.signAsync).toBeCalledWith(
        { id: userFromDB.id },
        { expiresIn: expect.any(String), secret: expect.any(String) }
      );
    });
  });

  describe("updateHashedRefreshToken", () => {
    it("should reutrn error if an error in typeORM", async () => {
      usersRepository.create.mockReturnValueOnce(idAndRefreshToken);
      usersRepository.save.mockRejectedValueOnce(new Error());

      await expect(
        authService.updateHashedRefreshToken(
          idAndRefreshToken.id,
          idAndRefreshToken.refreshToken
        )
      ).rejects.toThrowError(new Error());

      expect(usersRepository.create).toBeCalledTimes(1);
      expect(usersRepository.create).toBeCalledWith(idAndRefreshToken);
      expect(usersRepository.save).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledWith(idAndRefreshToken);
    });

    it("should successfuly return user after update hashed password", async () => {
      usersRepository.create.mockReturnValueOnce(idAndRefreshToken);
      usersRepository.save.mockReturnValueOnce(idAndRefreshToken);

      const result = await authService.updateHashedRefreshToken(
        idAndRefreshToken.id,
        idAndRefreshToken.refreshToken
      );
      expect(result).toBe(idAndRefreshToken);

      expect(usersRepository.create).toBeCalledTimes(1);
      expect(usersRepository.create).toBeCalledWith(idAndRefreshToken);
      expect(usersRepository.save).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledWith(idAndRefreshToken);
    });
  });

  describe("validateUser", () => {
    it("should return error if there is an error in typeORM", async () => {
      usersRepository.findOne.mockRejectedValueOnce(new Error());
      jest.spyOn(bcrypt, "compare");

      await expect(
        authService.validateUser(userFromDB.email, userFromDB.password)
      ).rejects.toThrowError();

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.findOne).toBeCalledWith(
        validateUserInput(userFromDB.email)
      );
      expect(bcrypt.compare).toBeCalledTimes(0);
    });

    it("should return an error response if the ID does not exist", async () => {
      usersRepository.findOne.mockReturnValueOnce(undefined);
      jest.spyOn(bcrypt, "compare");

      await expect(
        authService.validateUser(failEmail, userFromDB.password)
      ).rejects.toThrowError();

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.findOne).toBeCalledWith(
        validateUserInput(failEmail)
      );
      expect(bcrypt.compare).toBeCalledTimes(0);
    });

    it("should return null if the password does not match", async () => {
      usersRepository.findOne.mockResolvedValueOnce(userFromDB);
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(async () => {
        return false;
      });

      const result = await authService.validateUser(emailInput, passwordInput);
      expect(result).toBeNull();

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.findOne).toBeCalledWith(
        validateUserInput(userFromDB.email)
      );
      expect(bcrypt.compare).toBeCalledTimes(1);
      expect(bcrypt.compare).toBeCalledWith(passwordInput, userFromDB.password);
    });

    it("should return user if successful", async () => {
      const { password, ...userOutput } = userFromDB;
      usersRepository.findOne.mockResolvedValueOnce(userFromDB);
      jest.spyOn(bcrypt, "compare").mockImplementationOnce(async () => {
        return true;
      });

      const result = await authService.validateUser(emailInput, passwordInput);
      expect(result).toEqual(userOutput);

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.findOne).toBeCalledWith(
        validateUserInput(userFromDB.email)
      );
      expect(bcrypt.compare).toBeCalledTimes(2);
      expect(bcrypt.compare).toBeCalledWith(passwordInput, userFromDB.password);
    });
  });
});
