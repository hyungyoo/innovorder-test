import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { UsersModule } from "./users/users.module";
import * as path from "path";
import { Users } from "./users/entities/user.entity";
import { AuthModule } from "./auth/auth.module";

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
      // logging: process.env.NODE_ENV === "dev",
      logging: false,
      entities: [Users],
      keepConnectionAlive: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
