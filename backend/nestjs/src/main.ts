import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // get env vars

  // enable CORS for localhost frontend
  app.enableCors();

  // validates DTO's pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete all but DTO
      transform: true, // type casting
    }),
  );

  // use global error handler
  app.useGlobalFilters(new GlobalExceptionFilter());
  // subscribe to MQTT broker
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
  await app.listen(configService.get<number>('app.port')!);
}
void bootstrap();
