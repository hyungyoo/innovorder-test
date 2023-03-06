import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { UsersModule } from "./users/users.module";
import * as path from "path";
import { Users } from "./users/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UndefinedToNullInterceptor } from "./Interceptors/undefinedToNull.interceptor";
import { RedisModule } from "./redis/redis.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { FoodModule } from './food/food.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
      ignoreEnvFile: process.env.NODE_ENV === "prod",
      validationSchema: joi.object({
        POSTGRES_HOST: joi.string().required(),
        POSTGRES_PORT: joi.string().required(),
        POSTGRES_PASSWORD: joi.string().required(),
        POSTGRES_USERNAME: joi.string().required(),
        POSTGRES_DB: joi.string().required(),
        APP_PORT: joi.string(),
        BACKEND_PORT: joi.string(),
        JWT_ACCESS_SECRET: joi.string().required(),
        JWT_REFRESH_SECRET: joi.string().required(),
        JWT_ACCESS_EXPIRATION_TIME: joi.string().required(),
        JWT_REFRESH_EXPIRATION_TIME: joi.string().required(),
        API_VERSION: joi.string().required(),
        REDIS_HOST: joi.string().required(),
        REDIS_PORT: joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: process.env.ENV !== "prod",
      logging: false,
      entities: [Users],
      keepConnectionAlive: true,
    }),
    PassportModule.register({}),
    JwtModule.register({}),
    UsersModule,
    AuthModule,
    RedisModule,
    FoodModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UndefinedToNullInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
