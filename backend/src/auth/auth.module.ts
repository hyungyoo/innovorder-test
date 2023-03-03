import { Module, Provider } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local/local.stragegy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "src/users/entities/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
