import { ProcessedSensorData } from '../entities/processed-sensor.entity';
import { EfficiencyEnum } from '../../common/enum/efficiency.enum';

export class HistoryReadingsDto {
  samples!: ProcessedSensorData[];
  period_efficiency!: {
    from: Date;
    to: Date;
    efficiency: EfficiencyEnum;
  }[];
  period!: { from: Date; to: Date };
}
