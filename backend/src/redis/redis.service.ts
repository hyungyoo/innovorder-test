import { Inject, Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_BLACKLIST_INSTANCE")
    private readonly blackListClient: Redis,
    @Inject("REDIS_CACHE_INSTANCE") private readonly cacheClient: Redis
  ) {
    // 블랙리스트 set으로 등록
    // 블랙리스트 조회
    // 캐쉬 key value로 등록
    // 캐쉬 조회
  }
}
