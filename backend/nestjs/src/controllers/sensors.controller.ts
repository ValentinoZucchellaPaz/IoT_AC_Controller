import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';
import { SensorProcessingService } from '../services/sensor-processing.service';

@Controller('sensors')
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);

  constructor(private readonly sensorDataProcessor: SensorProcessingService) {}

  @EventPattern('sensor/datos') // subscribe to mqtt topic
  @UsePipes(new ValidationPipe()) // validate dto for mqtt
  async createFromMqtt(@Payload() dto: CreateSensorDto) {
    try {
      await this.sensorDataProcessor.processIncomingData(dto);
    } catch (error) {
      this.logger.error("MQTT ${'sensor/datos'}: ", error);
    }
  }
}
