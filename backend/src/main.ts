import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./http-exception.filter";
import { VERSION_SWAGGER } from "./common/constants/core.constants";

/**
 * validation pipe
 * http exception filter
 * swagger
 */
async function bootstrap() {
  const logger = new Logger("ServerListening");
  const dockerPort = 8080;

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({}));
  const config = new DocumentBuilder()
    .setTitle("Innovorder test")
    .setDescription("innovorder test with CRUD")
    .setVersion(VERSION_SWAGGER)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000, () => {
    logger.verbose(`Api server domain : [http://localhost:${dockerPort}]`);
  });
}
bootstrap();
