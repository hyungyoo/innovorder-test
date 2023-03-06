import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenStrategy } from "src/auth/strategies/jwt/access-token.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, AccessTokenStrategy],
})
export class UsersModule {}
