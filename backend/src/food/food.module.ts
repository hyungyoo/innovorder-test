import { Module } from "@nestjs/common";
import { FoodService } from "./food.service";
import { FoodController } from "./food.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: +process.env.HTTP_TIMEOUT || 5000,
        maxRedirects: +process.env.HTTP_MAX_REDIRECTS || 5,
      }),
    }),
  ],
  providers: [FoodService],
  controllers: [FoodController],
})
export class FoodModule {}
