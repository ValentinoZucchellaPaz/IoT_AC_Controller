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

    let periodStart: number | null = null;

    for (let i = 0; i <= input.length; i++) {
      const isLast = i === input.length;
      const sample = isLast ? null : input[i];

      const shouldEndPeriod =
        periodStart !== null &&
        (isLast ||
          !sample!.ac_state ||
          sample!.desired_temperature !== input[i - 1].desired_temperature);

      if (shouldEndPeriod) {
        const periodSamples = input.slice(periodStart, i);
        const firstSample = periodSamples[0];
        const lastSample = periodSamples.at(-1)!;

        let efficiency = EfficiencyEnum.LOW_EFFICIENCY;

        let reachTimestamp: Date | null = null;

        for (const s of periodSamples) {
          if (s.avg_temperature <= s.desired_temperature) {
            reachTimestamp = s.ts_end;
            break;
          }
        }

        if (reachTimestamp !== null) {
          const minutes =
            (reachTimestamp.getTime() - firstSample.ts_end.getTime()) /
            (1000 * 60);

          if (minutes <= 10) {
            efficiency = EfficiencyEnum.HIGH_EFFICIENCY;
          } else if (minutes <= 30) {
            efficiency = EfficiencyEnum.MEDIUM_EFFICIENCY;
          }
        }

        periods.push({
          from: firstSample.ts_end,
          to: lastSample.ts_end,
          efficiency,
        });

        periodStart = null;
      }

      if (!isLast && sample!.ac_state && periodStart === null) {
        periodStart = i;
      }
    }

    output.period_efficiency = periods;
  }
}
