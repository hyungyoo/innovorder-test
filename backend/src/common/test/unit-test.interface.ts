import { HttpStatus } from "@nestjs/common";
import { USER_CONFLICT_RESPONSE } from "src/users/constants/user.constants";
import {
  CreateUserInput,
  CreateUserOutput,
} from "src/users/dtos/create-user.dto";
import { Repository } from "typeorm";
import * as redis from "redis";
import { OpenFoodApiOutput } from "src/food/dtos/food.dto";

export type MockTypeRepository<T> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

export type MockRedisType = Partial<
  Record<keyof redis.RedisFunctions, jest.Mock>
>;

export const createUserInput: CreateUserInput = {
  email: "hyungyoo@gmail.com",
  password: "12345",
  firstName: "hyungjun",
  lastName: "yoo",
};

export const createUserOutput: CreateUserOutput = {
  success: true,
  code: 201,
  data: {
    user: {
      id: 1,
      email: `${createUserInput.email}`,
      firstName: `${createUserInput.firstName}`,
      lastName: `${createUserInput.lastName}`,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    },
  },
};

export const userFromDB = {
  id: expect.any(Number),
  email: `${createUserInput.email}`,
  password: `${createUserInput.password}`,
  firstName: `${createUserInput.firstName}`,
  lastName: `${createUserInput.lastName}`,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  refreshToken: expect.any(String),
};

export const updateUserInput = {
  email: `${userFromDB.email}`,
  password: `${createUserInput.password}`,
};

export const userForRespository: typeof userFromDB = {
  ...userFromDB,
  ...updateUserInput,
};

export const { password, refreshToken, ...updatedUser } = userForRespository;

export const updateUserOutputSuccess = {
  success: true,
  code: HttpStatus.OK,
  data: { user: updatedUser },
};

export const updateUserInputDiffEmail = {
  email: "test@email.com",
  password: "12345",
};

export const updateUserOutputFail = {
  success: false,
  code: HttpStatus.CONFLICT,
  error: { message: USER_CONFLICT_RESPONSE },
};

export const accessToken = "withExp";

export const payloadWithoutExp = {
  id: 1,
  iat: "iat",
};

export const payloadWithExp = () => ({
  id: 1,
  iat: Math.floor(Date.now() / 1000) - 100,
  exp: Math.floor(Date.now() / 1000) + 600,
});

export const accessTokenWithoutExp = "withoutExp";

export const barcode = "1234";

export const dataForSerialize = { a: "a" };

export const serializedData = JSON.stringify(dataForSerialize);

export const foodData = {
  product: expect.any(Object),
  status_verbose: "verbose",
};

export const foodSuccessOutput = {
  success: true,
  code: HttpStatus.OK,
  data: { product: foodData.product },
};

export const foodFailOutput = {
  success: false,
  code: HttpStatus.NOT_FOUND,
  error: { message: foodData.status_verbose },
};

export const openfoodApiOutput: OpenFoodApiOutput = {
  product: expect.any(Object),
  status_verbose: foodFailOutput.error.message,
  code: "code",
  status: foodSuccessOutput.code,
};

export const openFoodApiDto = {
  data: openfoodApiOutput,
};

export const openfoodApiFailOutput: OpenFoodApiOutput = {
  product: undefined,
  status_verbose: foodFailOutput.error.message,
  code: "code",
  status: foodSuccessOutput.code,
};
