import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalGuard extends AuthGuard("a") {
  constructor() {
    super();
    console.log(
      "*********************local guard constructor *********************"
    );
  }

  validate() {
    console.log(
      "*********************local guard validate *********************"
    );
  }
}
