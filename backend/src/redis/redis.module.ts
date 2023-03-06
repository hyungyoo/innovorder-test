import { Global, Module } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "./redis.service";

/**
 * 보통은 작은 프로젝트에서는 하나의 호스트에서 두 개의 인스턴스를 구성하여
 * 각각의 인스턴스에서 블랙리스트와 캐시를 처리합니다.
 * 이 방식은 호스트 비용을 절약하면서도 충분한 성능을 제공합니다.
 * 하나의 인스턴스에서 여러 데이터베이스를 제공하기 하는것은 필요하지 않은 추가 복잡성을 추가할 수 있습니다.
 * 두 대의 호스트를 사용하는것은 비용 측면에서는 비효율적일 수 있습니다.
 * 하지만 서버간의 분리를 통해 더 높은 안정성과 가용성을 제공할 수 있습니다. 그러나 작은 프로젝트에서는 대개 이러한 높은 안정성과 가용성이 필요하지 않을 수 있습니다.
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
  ],
  exports: ["REDIS_BLACKLIST_INSTANCE", "REDIS_CACHE_INSTANCE", RedisService],
})
export class RedisModule {}
