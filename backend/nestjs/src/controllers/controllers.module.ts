import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { ServicesModule } from 'src/services/services.module';
import { DataController } from './data.controller';

@Module({
  imports: [ServicesModule],
  controllers: [SensorsController, DataController],
})
export class ControllersModule {}
