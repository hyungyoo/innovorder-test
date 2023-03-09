import { Module } from "@nestjs/common";
import { FoodService } from "./food.service";
import { FoodController } from "./food.controller";
import { HttpModule } from "@nestjs/axios";
import { RedisService } from "src/redis/redis.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get<number>("HTTP_TIMEOUT", 5000),
        maxRedirects: configService.get<number>("HTTP_MAX_REDIRECTS", 5),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(), // ConfigModule을 추가합니다.
  ],
  providers: [FoodService, RedisService, JwtService],
  controllers: [FoodController],
})
export class FoodModule {}
