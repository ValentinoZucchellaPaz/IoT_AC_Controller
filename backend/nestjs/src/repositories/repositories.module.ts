import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsRepository } from './sensors.repository';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { HealthSensorData } from 'src/models/entities/health-sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessedSensorData, HealthSensorData])],
  providers: [SensorsRepository],
  exports: [SensorsRepository],
})
export class RepositoriesModule {}
