import { Global, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local/local.stragegy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenStrategy } from "./strategies/jwt/refresh-token.strategy";
import { AccessTokenStrategy } from "./strategies/jwt/access-token.strategy";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtService,
    RefreshTokenStrategy,
    AccessTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
