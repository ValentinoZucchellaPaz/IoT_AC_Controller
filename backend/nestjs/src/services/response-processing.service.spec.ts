/* eslint-disable */
import { ResponseProcessingService } from './response-processing.service';
import { ProcessedSensorData } from '../models/entities/processed-sensor.entity';
import { HistoryReadingsDto } from '../models/dto/history-readings.dto';

describe('ResponseProcessingService', () => {
  let service: ResponseProcessingService;
  let mockStrategies: { process: jest.Mock }[];

  beforeEach(() => {
    mockStrategies = [{ process: jest.fn() }];
    service = new ResponseProcessingService(mockStrategies as any);
  });

  it('should apply all strategies to input data', () => {
    const samples = [new ProcessedSensorData()];
    const result = service.processIncomingData(samples);

    expect(mockStrategies[0].process).toHaveBeenCalledTimes(1);
    expect(mockStrategies[0].process).toHaveBeenCalledWith(
      samples,
      expect.any(HistoryReadingsDto),
    );
    expect(result).toBeInstanceOf(HistoryReadingsDto);
  });

  it('should apply strategies in order', () => {
    const callOrder: number[] = [];
    const s1 = {
      process: jest.fn().mockImplementation(() => callOrder.push(1)),
    };
    const s2 = {
      process: jest.fn().mockImplementation(() => callOrder.push(2)),
    };

    const multiStrategyService = new ResponseProcessingService([s1, s2] as any);

    multiStrategyService.processIncomingData([new ProcessedSensorData()]);

    expect(callOrder).toEqual([1, 2]);
  });

  it('should handle empty input', () => {
    const result = service.processIncomingData([]);

    expect(mockStrategies[0].process).toHaveBeenCalledWith(
      [],
      expect.any(HistoryReadingsDto),
    );
    expect(result).toBeInstanceOf(HistoryReadingsDto);
  });

  it('should set period_efficiency from strategies', () => {
    mockStrategies[0].process.mockImplementation(
      (_input: ProcessedSensorData[], output: HistoryReadingsDto) => {
        output.period_efficiency = [];
      },
    );

    const result = service.processIncomingData([new ProcessedSensorData()]);

    expect(result.period_efficiency).toEqual([]);
  });
});
