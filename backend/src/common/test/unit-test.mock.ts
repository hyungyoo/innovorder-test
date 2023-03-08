export const MockRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

export const payloadWithExp = {
  id: 1,
  iat: "iat",
  exp: "exp",
};

export const payloadWithoutExp = {
  id: 1,
  iat: "iat",
};

export const accessTokenWithoutExp = "withoutExp";

export const MockJwtService = () => ({
  decode: jest.fn((accessToken: string) => {
    console.log(accessToken);
    if (accessToken === "withoutExp") return payloadWithoutExp;
    return payloadWithExp;
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
  hget: jest.fn(),
});

export const MockConfigService = () => ({
  get: jest.fn(),
});
