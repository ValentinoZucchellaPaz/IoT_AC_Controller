import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('IoT AC Monitor API')
    .setDescription('API for monitoring and controlling AC units via ESP32')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice(
    {
      transport: Transport.MQTT,
      options: {
        url: configService.get<string>('mqtt.url'),
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  const port = configService.get<number>('app.port')!;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
void bootstrap();
