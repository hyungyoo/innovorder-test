import { Repository } from "typeorm";

export type MockTypeRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
