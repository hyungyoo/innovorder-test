import { Global, Module } from "@nestjs/common";
import { Redis } from "ioredis";

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
  ],
  exports: ["REDIS_BLACKLIST_INSTANCE", "REDIS_CACHE_INSTANCE"],
})
export class RedisModule {}
