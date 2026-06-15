import { Controller, Get, Logger, Param, ParseEnumPipe } from '@nestjs/common';
import { HistoryPeriod } from 'src/common/enum/history-period.enum';
import { SensorErrorResponseDto } from 'src/models/dto/response/sensor-error-response.dto';
import { SensorHistoryResponseDto } from 'src/models/dto/response/sensor-history-response.dto';
import { SensorResponseDto } from 'src/models/dto/response/sensor-response.dto';
import { ResponseProcessingService } from 'src/services/response-processing.service';
import { RetrieveDataService } from 'src/services/retrieve-data.service';

@Controller('data')
export class DataController {
  private readonly logger = new Logger(DataController.name);

  constructor(
    private readonly responseDataProcessor: ResponseProcessingService,
    private readonly retrieveDataService: RetrieveDataService,
  ) {}

  //   {
  //   "success": true,
  //   "message": "ok",
  //   "data": {
  //     "id": 12,
  //     "device_id": "ESP32_01",
  //     "ac_state": false,
  //     "desired_temperature": 22,
  //     "min_temperature": 22,
  //     "max_temperature": 22,
  //     "avg_temperature": 22,
  //     "ts_end": "2026-06-02T07:00:00.000Z",
  //     "created_at": "2026-06-02T09:39:04.282Z"
  //   },
  //   "timestamp": "2026-06-02T06:40:06.038Z"
  //   }

  /**
   * Returns the most recent sensor sample stored in the database.
   * Returns success=false if no data exists.
   */
  @Get('/last')
  async getLast(): Promise<SensorResponseDto | SensorErrorResponseDto> {
    const lastSample = await this.retrieveDataService.getLastSample();
    const lastStatus = await this.retrieveDataService.getLastStatus();

    if (!lastSample || !lastStatus)
      return new SensorErrorResponseDto(
        'NO_CONTENT',
        !lastSample ? 'No sensor data found' : 'No sensor status found',
        'No data available',
      );

    const response = new SensorResponseDto(lastSample, lastStatus, 'ok');

    this.logger.log('===========================================');
    this.logger.log('HTTP /data/last:', response);

    return response;
  }

  /**
   * Returns historical sensor data for the requested period.
   * Returns success=false if no data exists.
   * Supported periods: 1h, 6h, 12h, 1d, 3d, 7d
   */
  @Get('/history/:period')
  async getHistory(
    @Param('period', new ParseEnumPipe(HistoryPeriod)) // nest default parse error handling
    period: HistoryPeriod,
  ): Promise<SensorHistoryResponseDto | SensorErrorResponseDto> {
    // gets the data of that period (enum with all posible periods)
    const rawData = await this.retrieveDataService.getHistorySamples(period);

    if (rawData.length == 0)
      return new SensorErrorResponseDto(
        'NO_CONTENT',
        'No history data found',
        'No data available',
      );

    // apply strategy
    const processedData =
      this.responseDataProcessor.processIncomingData(rawData);

    // create response dto
    const response = new SensorHistoryResponseDto(
      processedData.samples.length,
      processedData,
      'ok',
    );

    this.logger.log('===========================================');
    this.logger.log(`HTTP /data/history/${period}`, response);
    return response;
  }

  // testing global error handler
  @Get('/test-error')
  testError() {
    throw new Error('Test error, everything ok');
  }
}
