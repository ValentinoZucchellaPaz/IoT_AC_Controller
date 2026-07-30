/* eslint-disable */
import { DataController } from './data.controller';
import { HistoryPeriod } from '../common/enum/history-period.enum';
import { ProcessedSensorData } from '../models/entities/processed-sensor.entity';
import { HealthSensorData } from '../models/entities/health-sensor.entity';
import { SensorResponseDto } from '../models/dto/response/sensor-response.dto';
import { SensorErrorResponseDto } from '../models/dto/response/sensor-error-response.dto';
import { SensorHistoryResponseDto } from '../models/dto/response/sensor-history-response.dto';
import { HistoryReadingsDto } from '../models/dto/history-readings.dto';

function makeSample(
  overrides?: Partial<ProcessedSensorData>,
): ProcessedSensorData {
  const s = new ProcessedSensorData();
  s.id = 1;
  s.device_id = 'ESP32_01';
  s.ac_state = true;
  s.desired_temperature = 22;
  s.min_temperature = 20;
  s.max_temperature = 24;
  s.avg_temperature = 22.5;
  s.current_humidity = 55;
  s.ts_end = new Date('2026-01-01T00:00:00Z');
  s.created_at = new Date();
  Object.assign(s, overrides);
  return s;
}

function makeStatus(overrides?: Partial<HealthSensorData>): HealthSensorData {
  const s = new HealthSensorData();
  s.id = 1;
  s.device_id = 'ESP32_01';
  s.status = true;
  s.ts_end = new Date('2026-01-01T00:00:00Z');
  Object.assign(s, overrides);
  return s;
}

describe('DataController', () => {
  let controller: DataController;
  let mockResponseProcessor: { processIncomingData: jest.Mock };
  let mockRetrieveService: {
    getLastSample: jest.Mock;
    getLastStatus: jest.Mock;
    getHistorySamples: jest.Mock;
  };

  beforeEach(() => {
    mockResponseProcessor = { processIncomingData: jest.fn() };
    mockRetrieveService = {
      getLastSample: jest.fn(),
      getLastStatus: jest.fn(),
      getHistorySamples: jest.fn(),
    };

    controller = new DataController(
      mockResponseProcessor as any,
      mockRetrieveService as any,
    );
  });

  describe('getLast', () => {
    it('should return SensorResponseDto when data and status exist', async () => {
      const sample = makeSample();
      const status = makeStatus();
      mockRetrieveService.getLastSample.mockResolvedValue(sample);
      mockRetrieveService.getLastStatus.mockResolvedValue(status);

      const result = await controller.getLast();

      expect(result).toBeInstanceOf(SensorResponseDto);
      expect(result.success).toBe(true);
      expect(result.message).toBe('ok');
      expect((result as SensorResponseDto).data).toBeDefined();
    });

    it('should return error when no sensor data', async () => {
      mockRetrieveService.getLastSample.mockResolvedValue(null);
      mockRetrieveService.getLastStatus.mockResolvedValue(makeStatus());

      const result = await controller.getLast();

      expect(result).toBeInstanceOf(SensorErrorResponseDto);
      expect(result.success).toBe(false);
    });

    it('should return error when no sensor status', async () => {
      mockRetrieveService.getLastSample.mockResolvedValue(makeSample());
      mockRetrieveService.getLastStatus.mockResolvedValue(null);

      const result = await controller.getLast();

      expect(result).toBeInstanceOf(SensorErrorResponseDto);
      expect(result.success).toBe(false);
    });

    it('should return error when both are missing', async () => {
      mockRetrieveService.getLastSample.mockResolvedValue(null);
      mockRetrieveService.getLastStatus.mockResolvedValue(null);

      const result = await controller.getLast();

      expect(result).toBeInstanceOf(SensorErrorResponseDto);
      expect(result.success).toBe(false);
    });
  });

  describe('getHistory', () => {
    it('should return history with processed data', async () => {
      const samples = [
        makeSample(),
        makeSample({ ts_end: new Date('2026-01-01T01:00:00Z') }),
      ];
      mockRetrieveService.getHistorySamples.mockResolvedValue(samples);

      const processed = new HistoryReadingsDto();
      processed.samples = samples;
      processed.period_efficiency = [];
      mockResponseProcessor.processIncomingData.mockReturnValue(processed);

      const result = await controller.getHistory(HistoryPeriod.ONE_DAY);

      expect(result).toBeInstanceOf(SensorHistoryResponseDto);
      expect(result.success).toBe(true);
      expect((result as SensorHistoryResponseDto).total).toBe(2);
      expect(mockRetrieveService.getHistorySamples).toHaveBeenCalledWith(
        HistoryPeriod.ONE_DAY,
      );
    });

    it('should return error when no history data', async () => {
      mockRetrieveService.getHistorySamples.mockResolvedValue([]);

      const result = await controller.getHistory(HistoryPeriod.ONE_HOUR);

      expect(result).toBeInstanceOf(SensorErrorResponseDto);
      expect(result.success).toBe(false);
      expect(mockResponseProcessor.processIncomingData).not.toHaveBeenCalled();
    });
  });

  describe('testError', () => {
    it('should throw an error', () => {
      expect(() => controller.testError()).toThrow('Test error, everything ok');
    });
  });
});
