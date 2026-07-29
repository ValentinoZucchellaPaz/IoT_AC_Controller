import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { ServicesModule } from 'src/services/services.module';
import { DataController } from './data.controller';
import { DeviceCommandController } from './device-command.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [ServicesModule],
  controllers: [
    SensorsController,
    DataController,
    DeviceCommandController,
    HealthController,
  ],
})
export class ControllersModule {}
