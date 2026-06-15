import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';
import { SensorProcessingService } from '../services/sensor-processing.service';
import { HealthSensorDto } from 'src/models/dto/health-sensor.dto';

@Controller('sensors')
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);

  constructor(private readonly sensorDataProcessor: SensorProcessingService) {}

  @EventPattern('sensor/datos') // subscribe to sensor data mqqt topic
  @UsePipes(new ValidationPipe()) // validate dto for mqtt
  async handleSensorData(@Payload() dto: CreateSensorDto) {
    try {
      await this.sensorDataProcessor.processIncomingData(dto);
      this.logger.log('===========================================');
      this.logger.log("MQTT ${'sensor/datos'}: ", dto);
    } catch (error) {
      this.logger.error("MQTT ${'sensor/datos'}: ", error);
    }
  }

  @EventPattern('sensor/status') // subscribe to mqtt topic
  @UsePipes(new ValidationPipe()) // validate dto for mqtt
  async handleSensorStatus(@Payload() dto: HealthSensorDto) {
    try {
      await this.sensorDataProcessor.saveSensorStatus(dto);
      this.logger.log('===========================================');
      this.logger.log("MQTT ${'sensor/status'}: ", dto);
    } catch (error) {
      this.logger.error("MQTT ${'sensor/status'}: ", error);
    }
  }
}
