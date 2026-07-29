import { RepositoriesModule } from 'src/repositories/repositories.module';
import { Module } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';
import { DesiredTempModeStrategy } from 'src/processing/strategies/desired-temp-mode.strategy';
import { CurrentTempStatsStrategy } from 'src/processing/strategies/current-temp-stats.strategy';
import {
  INCOMING_SENSOR_DATA_STRATEGIES,
  SensorProcessingService,
} from './sensor-processing.service';
import {
  RESPONSE_DATA_STRATEGIES,
  ResponseProcessingService,
} from './response-processing.service';
import { EfficiencyAnalyzerStrategy } from 'src/processing/strategies/efficiency-analyzer.strategy';
import { RetrieveDataService } from './retrieve-data.service';

@Module({
  imports: [RepositoriesModule],

  providers: [
    SensorProcessingService, // register as injectable
    ResponseProcessingService, // register as injectable
    RetrieveDataService, // register as injectable
    DesiredTempModeStrategy,
    CurrentTempStatsStrategy,
    EfficiencyAnalyzerStrategy,
    MqttPublisherService,

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
      useFactory: (efficiencyAnalyzerStrategy: EfficiencyAnalyzerStrategy) => [
        efficiencyAnalyzerStrategy,
      ],

      inject: [EfficiencyAnalyzerStrategy],
    },
  ],

  // export for controller module
  exports: [
    SensorProcessingService,
    ResponseProcessingService,
    RetrieveDataService,
    MqttPublisherService,
  ],
})
export class ServicesModule {}
