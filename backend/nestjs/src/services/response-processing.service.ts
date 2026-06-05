import { Inject, Injectable } from '@nestjs/common';
import { ProcessDataStrategy } from '../processing/interfaces/process-data.strategy';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { HistoryReadingsDto } from 'src/models/dto/history-readings.dto';

export const RESPONSE_DATA_STRATEGIES = 'RESPONSE_DATA_STRATEGIES';

@Injectable()
export class ResponseProcessingService {
  constructor(
    @Inject(RESPONSE_DATA_STRATEGIES)
    private readonly strategies: ProcessDataStrategy<
      ProcessedSensorData[],
      HistoryReadingsDto
    >[],
  ) {}

  /**
   * Applies efficiency analizer strategies to history data:
   *
   * Searches for continuous ac_state=true samples, then determines the period efficiency considering the time needed to reach the desired temp:
   * - 0: HIGH_EFFICIENCY -> less than 10min
   * - 1: MEDIUM_EFFICIENCY -> less than 30min
   * - 2: LOW_EFFICIENCY -> more than 30min
   */
  processIncomingData(input: ProcessedSensorData[]): HistoryReadingsDto {
    const output = new HistoryReadingsDto();

    this.strategies.forEach((s) => {
      s.process(input, output);
    });

    return output;
  }
}
