import { Injectable } from '@nestjs/common';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { SensorsRepository } from 'src/repositories/sensors.repository';
import { HistoryPeriod } from 'src/common/enum/history-period.enum';
import { HealthSensorData } from 'src/models/entities/health-sensor.entity';

@Injectable()
export class RetrieveDataService {
  constructor(private readonly sensorsRepository: SensorsRepository) {}

  /**fetchs the last sample stored in db */
  async getLastSample(): Promise<ProcessedSensorData | null> {
    return this.sensorsRepository.findLastData();
  }

  /**
   * Calculates the time period from the enum passed (ex. 1d), fetch the data in the repository and returns it
   * @param period: enum with all posible period (1h, 6h, 12h, 1d, 3d, 7d)
   * @returns samples: fetched that period data from db
   */
  async getHistorySamples(
    period: HistoryPeriod,
  ): Promise<ProcessedSensorData[]> {
    const toTs = Math.floor(Date.now() / 1000);

    let fromTs: number;

    switch (period) {
      case HistoryPeriod.ONE_HOUR:
        fromTs = toTs - 60 * 60;
        break;

      case HistoryPeriod.SIX_HOURS:
        fromTs = toTs - 6 * 60 * 60;
        break;

      case HistoryPeriod.TWELVE_HOURS:
        fromTs = toTs - 12 * 60 * 60;
        break;

      case HistoryPeriod.ONE_DAY:
        fromTs = toTs - 24 * 60 * 60;
        break;

      case HistoryPeriod.THREE_DAYS:
        fromTs = toTs - 3 * 24 * 60 * 60;
        break;

      case HistoryPeriod.SEVEN_DAYS:
        fromTs = toTs - 7 * 24 * 60 * 60;
        break;
    }

    return this.sensorsRepository.findHistoryData(fromTs, toTs);
  }

  /**fetchs the last sample stored in db */
  async getLastStatus(): Promise<HealthSensorData | null> {
    return this.sensorsRepository.findLastStatus();
  }
}
