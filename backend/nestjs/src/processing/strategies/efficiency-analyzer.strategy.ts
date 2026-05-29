import { Injectable } from '@nestjs/common';
import { ProcessDataStrategy } from '../interfaces/process-data.strategy';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { HistoryReadingsDto } from 'src/models/dto/history-readings.dto';

@Injectable()
export class EfficiencyAnalizerStrategy implements ProcessDataStrategy<
  ProcessedSensorData,
  HistoryReadingsDto
> {
  readonly name = 'desired-temperature-mode';

  process(input: ProcessedSensorData, output: HistoryReadingsDto) {
    console.log(input, output);
  }
}
