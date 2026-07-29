import { Injectable } from '@nestjs/common';
import { ProcessDataStrategy } from '../interfaces/process-data.strategy';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { HistoryReadingsDto } from 'src/models/dto/history-readings.dto';
import { EfficiencyEnum } from 'src/common/enum/efficiency.enum';

@Injectable()
export class EfficiencyAnalyzerStrategy implements ProcessDataStrategy<
  ProcessedSensorData[],
  HistoryReadingsDto
> {
  readonly name = 'efficiency-analyzer';

  process(input: ProcessedSensorData[], output: HistoryReadingsDto): void {
    output.samples = input;
    const periods: HistoryReadingsDto['period_efficiency'] = [];
    let startIndex: number | null = null;

    for (let i = 0; i <= input.length; i++) {
      const sample = input[i];

      const isRunning = sample?.ac_state === true;

      if (startIndex === null && isRunning) {
        startIndex = i;
        continue;
      }

      const finishedPeriod =
        startIndex !== null && (!isRunning || i === input.length);

      if (!finishedPeriod) {
        continue;
      }

      const periodSamples = input.slice(startIndex!, i);

      const first = periodSamples[0];
      const last = periodSamples.at(-1)!;

      let reachTimestamp: Date | null = null;

      for (const current of periodSamples) {
        if (current.avg_temperature <= current.desired_temperature) {
          reachTimestamp = current.ts_end;
          break;
        }
      }

      let efficiency: EfficiencyEnum;

      if (reachTimestamp === null) {
        efficiency = EfficiencyEnum.LOW_EFFICIENCY;
      } else {
        const minutes =
          (reachTimestamp.getTime() - first.ts_end.getTime()) / (1000 * 60);

        if (minutes <= 10) {
          efficiency = EfficiencyEnum.HIGH_EFFICIENCY;
        } else if (minutes <= 30) {
          efficiency = EfficiencyEnum.MEDIUM_EFFICIENCY;
        } else {
          efficiency = EfficiencyEnum.LOW_EFFICIENCY;
        }
      }

      periods.push({
        from: first.ts_end,
        to: last.ts_end,
        efficiency,
      });

      startIndex = null;
    }

    output.period_efficiency = periods;
  }
}
