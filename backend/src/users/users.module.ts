import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { AuthService } from "src/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Users]), JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
