import { Injectable } from '@nestjs/common';
import { ProcessDataStrategy } from '../interfaces/process-data.strategy';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { HistoryReadingsDto } from 'src/models/dto/history-readings.dto';
import { EfficiencyEnum } from 'src/common/enum/efficiency.enum';

@Injectable()
export class EfficiencyAnalizerStrategy implements ProcessDataStrategy<
  ProcessedSensorData[],
  HistoryReadingsDto
> {
  readonly name = 'efficiency-analizer';

  /** Searches for continuous ac_state=true samples, then determines the period efficiency considering the time needed to reach the desired temp:
   * - 0: HIGH_EFFICIENCY -> less than 10min
   * - 1: MEDIUM_EFFICIENCY -> less than 30min
   * - 2: LOW_EFFICIENCY -> more than 30min
   */
  process(input: ProcessedSensorData[], output: HistoryReadingsDto): void {
    output.samples = input;
    const periods: HistoryReadingsDto['period_efficency'] = [];
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
        efficiency = EfficiencyEnum.LOW_EFFICENCY;
      } else {
        const minutes =
          (reachTimestamp.getTime() - first.ts_end.getTime()) / (1000 * 60);

        if (minutes <= 10) {
          efficiency = EfficiencyEnum.HIGH_EFFICENCY;
        } else if (minutes <= 30) {
          efficiency = EfficiencyEnum.MEDIUM_EFFICENCY;
        } else {
          efficiency = EfficiencyEnum.LOW_EFFICENCY;
        }
      }

      periods.push({
        from: first.ts_end,
        to: last.ts_end,
        efficency: efficiency,
      });

      startIndex = null;
    }

    output.period_efficency = periods;
  }
}
