import { HealthSensorData } from 'src/models/entities/health-sensor.entity';
import { ProcessedSensorData } from '../../entities/processed-sensor.entity';
import { LastSensorDataDto } from '../last-sample.dto';
import { BaseResponseDto } from './base-response.dto';

// OK - single query
export class SensorResponseDto extends BaseResponseDto<LastSensorDataDto> {
  constructor(
    sensorData: ProcessedSensorData,
    healthData: HealthSensorData,
    message: string,
  ) {
    super();

    this.success = true;
    this.message = message;

    this.data = {
      sensor: {
        device_id: sensorData.device_id,
        ac_state: sensorData.ac_state,
        desired_temperature: sensorData.desired_temperature,
        min_temperature: sensorData.min_temperature,
        max_temperature: sensorData.max_temperature,
        avg_temperature: sensorData.avg_temperature,
        current_humidity: sensorData.current_humidity,
        ts_end: sensorData.ts_end,
      },
      connectivity: {
        status: healthData.status,
        ts_end: healthData.ts_end,
      },
    };
  }
}
