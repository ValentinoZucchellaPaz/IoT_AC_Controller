import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { ServicesModule } from 'src/services/services.module';
@Module({
  imports: [ServicesModule],
  controllers: [SensorsController],
})
export class ControllersModule {}
