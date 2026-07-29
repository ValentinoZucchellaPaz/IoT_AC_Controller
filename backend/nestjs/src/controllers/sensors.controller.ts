import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';
import { SensorProcessingService } from '../services/sensor-processing.service';
import { HealthSensorDto } from 'src/models/dto/health-sensor.dto';

@ApiTags('Sensor Ingestion (MQTT)')
@Controller('sensors')
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);

  constructor(private readonly sensorDataProcessor: SensorProcessingService) {}

  @ApiOperation({
    summary: 'Ingest sensor data from MQTT',
    description:
      'Processes incoming sensor data from the sensor/datos MQTT topic.',
  })
  @EventPattern('sensor/datos')
  @UsePipes(new ValidationPipe())
  async handleSensorData(@Payload() dto: CreateSensorDto) {
    try {
      await this.sensorDataProcessor.processIncomingData(dto);
      this.logger.log('Received sensor/datos message', dto);
    } catch (error) {
      this.logger.error('Error processing sensor/datos', error);
    }
  }

  @ApiOperation({
    summary: 'Ingest sensor status from MQTT',
    description:
      'Processes incoming sensor status from the sensor/status MQTT topic.',
  })
  @EventPattern('sensor/status')
  @UsePipes(new ValidationPipe())
  async handleSensorStatus(@Payload() dto: HealthSensorDto) {
    try {
      await this.sensorDataProcessor.saveSensorStatus(dto);
      this.logger.log('Received sensor/status message', dto);
    } catch (error) {
      this.logger.error('Error processing sensor/status', error);
    }
  }
}
