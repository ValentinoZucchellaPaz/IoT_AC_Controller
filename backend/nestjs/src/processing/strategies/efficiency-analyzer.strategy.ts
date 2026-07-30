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

    if (input.length === 0) {
      output.period_efficiency = [];
      return;
    }

    let periodStart = 0;

    for (let i = 1; i <= input.length; i++) {
      const isLast = i === input.length;
      const prevDesired = input[i - 1].desired_temperature;
      const currDesired = isLast ? null : input[i].desired_temperature;

      if (!isLast && prevDesired === currDesired) continue;

      const periodSamples = input.slice(periodStart, i);
      const firstSample = periodSamples[0];
      const lastSample = periodSamples.at(-1)!;

      let activeStartIndex = -1;
      for (let j = 0; j < periodSamples.length; j++) {
        if (periodSamples[j].ac_state) {
          activeStartIndex = j;
          break;
        }
      }

      let efficiency = EfficiencyEnum.LOW_EFFICIENCY;

      if (activeStartIndex !== -1) {
        const activeSamples = periodSamples.slice(activeStartIndex);
        const effectiveStart = activeSamples[0];

        let reachTimestamp: Date | null = null;

        for (const sample of activeSamples) {
          if (sample.avg_temperature <= sample.desired_temperature) {
            reachTimestamp = sample.ts_end;
            break;
          }
        }

        if (reachTimestamp !== null) {
          const minutes =
            (reachTimestamp.getTime() - effectiveStart.ts_end.getTime()) /
            (1000 * 60);

          if (minutes <= 10) {
            efficiency = EfficiencyEnum.HIGH_EFFICIENCY;
          } else if (minutes <= 30) {
            efficiency = EfficiencyEnum.MEDIUM_EFFICIENCY;
          }
        }
      }

      periods.push({
        from: firstSample.ts_end,
        to: lastSample.ts_end,
        efficiency,
      });

      periodStart = i;
    }

    output.period_efficiency = periods;
  }
}
