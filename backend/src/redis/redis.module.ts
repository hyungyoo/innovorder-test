import { Global, Module } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "./redis.service";
import { JwtService } from "@nestjs/jwt";

/**
 * Usually, in small projects, two instances are configured on a single host, 
 * and each instance handles the blacklist and cache separately.
 * This approach provides sufficient performance while saving on hosting costs.
 * Providing multiple databases on a single instance can add unnecessary complexity.
 * Using two hosts may be inefficient in terms of cost.
 * Therefore, two instances are set up for the blacklist and food API cache, respectively, 
 * with key prefixes added to easily differentiate between them.
 */
@Global()
@Module({
  providers: [
    {
      provide: "REDIS_BLACKLIST_INSTANCE",
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          keyPrefix: "blacklist:", //
        });
      },
    },
    {
      provide: "REDIS_CACHE_INSTANCE",
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
          keyPrefix: "cache:", //
        });
      },
    },
    RedisService,
    JwtService,
  ],
  exports: ["REDIS_BLACKLIST_INSTANCE", "REDIS_CACHE_INSTANCE", RedisService],
})
export class RedisModule {}
