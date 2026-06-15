import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessedSensorData } from './models/entities/processed-sensor.entity';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import appConfig from './config/app.config';
import mqqtConfig from './config/mqqt.config';
import { ControllersModule } from './controllers/controllers.module';
import { HealthSensorData } from './models/entities/health-sensor.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mqqtConfig],
      envFilePath: '../../.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,

      entities: [ProcessedSensorData, HealthSensorData],

      synchronize: true,
    }),

    ControllersModule,
  ],
})
export class AppModule {}
