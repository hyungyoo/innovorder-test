import {
  payloadWithExp,
  payloadWithoutExp,
  serializedData,
} from "./unit-test.interface";

export const MockRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

export const MockJwtService = () => ({
  decode: jest.fn((accessToken: string) => {
    if (accessToken === "withoutExp") return payloadWithoutExp;
    return payloadWithExp();
  }),
});

export const MockRedisBlacklist = () => ({
  set: jest.fn(),
  expireat: jest.fn(),
  get: jest.fn(),
});

export const MockRedisClient = () => ({
  hset: jest.fn(),
  expireat: jest.fn(),
  hget: jest.fn((first: string, seconde: string) => {
    return serializedData;
  }),
});

export const MockConfigService = () => ({
  get: jest.fn(),
});
