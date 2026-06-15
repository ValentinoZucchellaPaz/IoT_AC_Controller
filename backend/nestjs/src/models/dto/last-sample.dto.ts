import { ProcessedSensorData } from '../entities/processed-sensor.entity';
import { HealthSensorData } from '../entities/health-sensor.entity';

export class LastSensorDataDto {
  sensor!: Pick<
    ProcessedSensorData,
    | 'device_id'
    | 'ac_state'
    | 'desired_temperature'
    | 'min_temperature'
    | 'max_temperature'
    | 'avg_temperature'
    | 'current_humidity'
    | 'ts_end'
  >;

  connectivity!: Pick<HealthSensorData, 'status' | 'ts_end'>;
}
