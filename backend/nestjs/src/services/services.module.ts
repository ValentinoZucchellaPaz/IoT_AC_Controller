import { RepositoriesModule } from 'src/repositories/repositories.module';
import { Module } from '@nestjs/common';
import { DesiredTempModeStrategy } from 'src/processing/strategies/desired-temp-mode.strategy';
import { CurrentTempStatsStrategy } from 'src/processing/strategies/current-temp-stats.strategy';
import {
  INCOMING_SENSOR_DATA_STRATEGIES,
  SensorProcessingService,
} from './sensor-processing.service';
import { RESPONSE_DATA_STRATEGIES } from './response-processing.service';
import { EfficiencyAnalizerStrategy } from 'src/processing/strategies/efficiency-analyzer.strategy';

@Module({
  imports: [RepositoriesModule],

  providers: [
    SensorProcessingService,
    DesiredTempModeStrategy,
    CurrentTempStatsStrategy,

    {
      provide: INCOMING_SENSOR_DATA_STRATEGIES,
      useFactory: (
        desiredTempModeStrategy: DesiredTempModeStrategy,
        currentTempStatsStrategy: CurrentTempStatsStrategy,
      ) => [desiredTempModeStrategy, currentTempStatsStrategy],

      inject: [DesiredTempModeStrategy, CurrentTempStatsStrategy],
    },
    {
      provide: RESPONSE_DATA_STRATEGIES,
      useFactory: (efficiencyAnalizerStrategy: EfficiencyAnalizerStrategy) => [
        efficiencyAnalizerStrategy,
      ],

      inject: [EfficiencyAnalizerStrategy],
    },
  ],

  exports: [SensorProcessingService],
})
export class ServicesModule {}
