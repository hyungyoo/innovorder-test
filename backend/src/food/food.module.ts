import { Module } from "@nestjs/common";
import { FoodService } from "./food.service";
import { FoodController } from "./food.controller";
import { HttpModule } from "@nestjs/axios";
import { RedisService } from "src/redis/redis.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    HttpModule.register({
      timeout: +process.env.HTTP_TIMEOUT || 5000,
      maxRedirects: +process.env.HTTP_MAX_REDIRECTS || 5,
    }),
  ],
  providers: [FoodService, RedisService, JwtService],
  controllers: [FoodController],
})
export class FoodModule {}
