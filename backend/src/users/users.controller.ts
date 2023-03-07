import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  CreateUserInput,
  CreateUserOutput,
  UserWithoutPassword,
} from "./dtos/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dtos/update-user.dto";
import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { CustomUserCreate } from "src/users/swaggers/create-user.decorators";
import { CustomUserUpdate } from "src/users/swaggers/update-user.decorator";
import { Users } from "./entities/user.entity";
import { AccessTokenGuard } from "src/auth/guards/jwt-access.guard";
import { AuthUser } from "src/auth/decorators/auth-user.decorator";
import { JwtHeaderInterceptor } from "src/Interceptors/jwt.interceptor";

@ApiExtraModels(Users)
@ApiTags("Users")
@Controller(`api/v${process.env.API_VERSION}/users`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Checks only for duplicate emails among the incoming arguments
   * and creates a user based on that
   * @param createUserInput  email, password, firstName, lastName
   * @returns created user
   */
  @CustomUserCreate()
  @Post()
  createUser(
    @Body() createUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    return this.usersService.createUser(createUserInput);
  }

  /**
   * Updates user information after verifying it from jwt.
   * 1. Obtains user information from AccessTokenGuard.
   * 2. Extracts the user id from the AuthUser decorator and passes it as an argument to updateUser.
   * 3. Registers the default access token on the blacklist.
   * 4. Updates the user.
   * 5. Sets a new access token in the response header.
   * @param user
   * @param updateUserInput
   * @returns updated user
   */
  @CustomUserUpdate()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(JwtHeaderInterceptor)
  @Patch()
  updateUser(
    @AuthUser() { id }: UserWithoutPassword,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    return this.usersService.updateUser(id, updateUserInput);
  }
}
