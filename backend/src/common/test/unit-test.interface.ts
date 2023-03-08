import { OmitType } from "@nestjs/mapped-types";
import {
  CreateUserInput,
  CreateUserOutput,
} from "src/users/dtos/create-user.dto";
import { UpdateUserInput } from "src/users/dtos/update-user.dto";
import { Users } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

export type MockTypeRepository<T> = Partial<
  Record<keyof Repository<T>, jest.Mock>
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
      email: "hyungyoo@gmail.com",
      firstName: "hyungjun",
      lastName: "yoo",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    },
  },
};

export const updateUserInput: UpdateUserInput = {
  email: "changed@gmail.com",
};

export class UserFromDB extends Users {}

export const userFromDB = {
  id: expect.any(Number),
  email: "hyungyoo@gmail.com",
  password: "12345",
  firstName: "hyungjun",
  lastName: "yoo",
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  refreshToken: expect.any(String),
};