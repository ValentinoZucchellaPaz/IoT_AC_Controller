import { ProcessedSensorData } from '../../entities/processed-sensor.entity';
import { BaseResponseDto } from './base-response.dto';

// OK - single query
export class SensorResponseDto extends BaseResponseDto<ProcessedSensorData> {
  constructor(data: ProcessedSensorData, message: string) {
    super();

    this.success = true;
    this.data = data;
    this.message = message;
  }
}
