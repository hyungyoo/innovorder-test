import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./http-exception.filter";

/**
 * validation pipe
 * http exception filter
 * swagger
 */
async function bootstrap() {
  const logger = new Logger("ServerListening");

  const port = +process.env.BACKEND_PORT || 3000;
  const appPort = +process.env.APP_PORT || 8080;
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({}));
  const config = new DocumentBuilder()
    .setTitle("Innovorder test")
    .setDescription("innovorder test with CRUD")
    .setVersion(process.env.API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(port, () => {
    logger.verbose(`Api Server : [http://localhost:${appPort}]`);
  });
}
bootstrap();

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(
//     exception: HttpException,
//     host: ArgumentsHost
//   ): Response<HttpExceptionOutput> {
//     const context = host.switchToHttp();
//     const response = context.getResponse<Response>();
//     const status = exception.getStatus();

//     const error = exception.getResponse();

//     return response.status(status).json({
//       success: false,
//       code: error["status"] || error["statusCode"],
//       error: { message: error["message"] },
//     });
//   }
// }


// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(
//     exception: HttpException,
//     host: ArgumentsHost
//   ): Response<HttpExceptionOutput> {
//     const context = host.switchToHttp();
//     const response = context.getResponse<Response>();
//     const status = exception.getStatus();
//     const error = exception.getResponse() as
//       | { message: any; statusCode: number }
//       | {
//           statusCode: HttpStatus.BAD_REQUEST;
//           message: string[];
//         };

//     if (
//       typeof error !== "string" &&
//       error.statusCode === HttpStatus.BAD_REQUEST
//     ) {
//       return response.status(status).json({
//         success: false,
//         code: error["status"],
//         error: { message: error.message },
//       });
//     }
//     return response.status(status).json({
//       success: false,
//       code: error["status"],
//       error: { message: error.message },
//     });
//   }
// }
