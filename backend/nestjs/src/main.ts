import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // get env vars

  // validates DTO's pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete all but DTO
      transform: true, // type casting
    }),
  );

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
