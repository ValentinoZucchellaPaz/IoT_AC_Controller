import { ProcessedSensorData } from '../entities/processed-sensor.entity';
import { EfficiencyEnum } from './efficiency.enum';

export class HistoryReadingsDto {
  samples!: ProcessedSensorData[];
  period_efficency!: { from: Date; to: Date; efficency: EfficiencyEnum }[];
  period!: { from: Date; to: Date };
}
