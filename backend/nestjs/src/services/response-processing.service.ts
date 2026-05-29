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

  async processIncomingData(
    input: ProcessedSensorData[],
  ): Promise<HistoryReadingsDto> {
    const output = new HistoryReadingsDto();

    this.strategies.forEach((s) => {
      s.process(input, output);
    });

    return await new Promise((res) => res(output));
  }
}
