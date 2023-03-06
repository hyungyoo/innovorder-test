import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_BLACKLIST_INSTANCE")
    private readonly blackListClient: Redis,
    @Inject("REDIS_CACHE_INSTANCE") private readonly cacheClient: Redis,
    private readonly configService: ConfigService
  ) {}

  async addToBlacklist(accessToken: string) {
    // return this.blackListClient.sadd("blacklist", accessToken, "PX", "시간");
    return this.blackListClient.sadd("blacklist", accessToken);
  }

  async isBlacklisted(accessToken: string) {
    return this.blackListClient.sismember("blacklist", accessToken);
  }

  async removeFromBlacklist(accessToken: string) {
    return this.blackListClient.srem("blacklist", accessToken);
  }

  async clearBlacklist() {
    return this.blackListClient.del("blacklist");
  }
}
