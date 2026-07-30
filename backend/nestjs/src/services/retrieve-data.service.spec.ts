/* eslint-disable */
import { RetrieveDataService } from './retrieve-data.service';
import { HistoryPeriod } from '../common/enum/history-period.enum';
import { ProcessedSensorData } from '../models/entities/processed-sensor.entity';
import { HealthSensorData } from '../models/entities/health-sensor.entity';

describe('RetrieveDataService', () => {
  let service: RetrieveDataService;
  let mockRepository: {
    findLastData: jest.Mock;
    findHistoryData: jest.Mock;
    findLastStatus: jest.Mock;
  };

  beforeEach(() => {
    mockRepository = {
      findLastData: jest.fn(),
      findHistoryData: jest.fn(),
      findLastStatus: jest.fn(),
    };

    service = new RetrieveDataService(mockRepository as any);
  });

  describe('getLastSample', () => {
    it('should return last sample from repository', async () => {
      const entity = new ProcessedSensorData();
      mockRepository.findLastData.mockResolvedValue(entity);

      const result = await service.getLastSample();

      expect(mockRepository.findLastData).toHaveBeenCalledTimes(1);
      expect(result).toBe(entity);
    });

    it('should return null when no data', async () => {
      mockRepository.findLastData.mockResolvedValue(null);

      const result = await service.getLastSample();

      expect(result).toBeNull();
    });
  });

  describe('getHistorySamples', () => {
    const NOW = 1768478400;
    const ONE_HOUR = 3600;
    const ONE_DAY = 86400;

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(NOW * 1000));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call repository with correct 1h range', async () => {
      await service.getHistorySamples(HistoryPeriod.ONE_HOUR);

      const { fromTs, toTs } = extractRange(mockRepository.findHistoryData);

      expect(toTs).toBe(NOW);
      expect(fromTs).toBe(NOW - ONE_HOUR);
    });

    it('should call repository with correct 6h range', async () => {
      await service.getHistorySamples(HistoryPeriod.SIX_HOURS);

      const { fromTs } = extractRange(mockRepository.findHistoryData);
      expect(fromTs).toBe(NOW - 6 * ONE_HOUR);
    });

    it('should call repository with correct 12h range', async () => {
      await service.getHistorySamples(HistoryPeriod.TWELVE_HOURS);

      const { fromTs } = extractRange(mockRepository.findHistoryData);
      expect(fromTs).toBe(NOW - 12 * ONE_HOUR);
    });

    it('should call repository with correct 1d range', async () => {
      await service.getHistorySamples(HistoryPeriod.ONE_DAY);

      const { fromTs } = extractRange(mockRepository.findHistoryData);
      expect(fromTs).toBe(NOW - ONE_DAY);
    });

    it('should call repository with correct 3d range', async () => {
      await service.getHistorySamples(HistoryPeriod.THREE_DAYS);

      const { fromTs } = extractRange(mockRepository.findHistoryData);
      expect(fromTs).toBe(NOW - 3 * ONE_DAY);
    });

    it('should call repository with correct 7d range', async () => {
      await service.getHistorySamples(HistoryPeriod.SEVEN_DAYS);

      const { fromTs } = extractRange(mockRepository.findHistoryData);
      expect(fromTs).toBe(NOW - 7 * ONE_DAY);
    });

    it('should return data from repository', async () => {
      const entities = [new ProcessedSensorData()];
      mockRepository.findHistoryData.mockResolvedValue(entities);

      const result = await service.getHistorySamples(HistoryPeriod.ONE_HOUR);

      expect(result).toBe(entities);
    });
  });

  describe('getLastStatus', () => {
    it('should return last status from repository', async () => {
      const entity = new HealthSensorData();
      mockRepository.findLastStatus.mockResolvedValue(entity);

      const result = await service.getLastStatus();

      expect(mockRepository.findLastStatus).toHaveBeenCalledTimes(1);
      expect(result).toBe(entity);
    });

    it('should return null when no status', async () => {
      mockRepository.findLastStatus.mockResolvedValue(null);

      const result = await service.getLastStatus();

      expect(result).toBeNull();
    });
  });
});

function extractRange(mock: jest.Mock): { fromTs: number; toTs: number } {
  const call = mock.mock.calls[0];
  return { fromTs: call[0], toTs: call[1] };
}
