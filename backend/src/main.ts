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
    logger.verbose(`Api server domain : [http://localhost:${appPort}]`);
  });
}
bootstrap();
