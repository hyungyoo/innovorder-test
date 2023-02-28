import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserInput, CreateUserOutput } from "./dto/create-user.dto";
import { UpdateUserInput, UpdateUserOutput } from "./dto/update-user.dto";
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import {
  ConflictResponseSwagger,
  NotFoundResponseSwagger,
} from "src/common/dtos/http-exception.output.dto";

@ApiTags("Users")
@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({
    description: "성공적으로 유저 정보를 생성 했습니다.",
    type: CreateUserOutput,
    status: HttpStatus.CREATED,
  })
  @ApiConflictResponse({
    description: "잘못된 요청입니다. 메일의 존재여부를 확인하세요",
    type: ConflictResponseSwagger,
    status: HttpStatus.CONFLICT,
  })
  @ApiOperation({
    summary: "Creates a new user",
    description: "이메일, 성, 이름, 비밀번호를 받아 유저를 생성 합니다.",
  })
  @ApiBody({ type: CreateUserInput })
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<CreateUserOutput> {
    return this.usersService.create(createUserInput);
  }

  // @ApiOperation({ summary: "get all users" })
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @ApiOperation({ summary: "get user by user id" })
  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @ApiOkResponse({
    description: "성공적으로 유저 정보를 업데이트 했습니다.",
    type: UpdateUserOutput,
    status: HttpStatus.OK,
  })
  @ApiNotFoundResponse({
    description: "잘못된 요청입니다. 아이디의 존재여부를 확인하세요",
    type: NotFoundResponseSwagger,
    status: HttpStatus.NOT_FOUND,
  })
  @ApiConflictResponse({
    description: "잘못된 요청입니다. 메일의 존재여부를 확인하세요",
    type: ConflictResponseSwagger,
    status: HttpStatus.CONFLICT,
  })
  @ApiOperation({
    summary: "update user",
    description:
      "이메일, 성, 이름, 비밀번호중에 수정을 원하는 정보를 받아 유저 정보를 업데이트합니다",
  })
  @Patch(":id")
  @ApiBody({ type: UpdateUserInput })
  update(
    @Param("id") id: string,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<UpdateUserOutput> {
    return this.usersService.update(+id, updateUserInput);
  }

  // @ApiOperation({ summary: "delete user" })
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.usersService.remove(+id);
  // }
}
