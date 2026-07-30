/* eslint-disable */
import { SensorProcessingService } from './sensor-processing.service';
import { ProcessedSensorData } from '../models/entities/processed-sensor.entity';
import { HealthSensorData } from '../models/entities/health-sensor.entity';

describe('SensorProcessingService', () => {
  let service: SensorProcessingService;
  let mockStrategies: { process: jest.Mock }[];
  let mockRepository: { saveData: jest.Mock; saveStatus: jest.Mock };

  beforeEach(() => {
    mockStrategies = [{ process: jest.fn() }];
    mockRepository = {
      saveData: jest.fn(),
      saveStatus: jest.fn(),
    };

    service = new SensorProcessingService(
      mockStrategies as any,
      mockRepository as any,
    );
  });

  describe('processIncomingData', () => {
    it('should apply strategies and save data', async () => {
      const saved = new ProcessedSensorData();
      mockRepository.saveData.mockResolvedValue(saved);

      const input = {
        device_id: 'ESP32_01',
        current_humidity: 55,
        ac_state: true,
        ts_end: 1700000000,
        valid_samples: 3,
        current_temperature: [22, 23, 24],
        desired_temperature: [22, 22, 22],
      } as any;

      const result = await service.processIncomingData(input);

      expect(mockStrategies[0].process).toHaveBeenCalledTimes(1);
      expect(mockRepository.saveData).toHaveBeenCalledTimes(1);
      expect(result).toBe(saved);
    });

    it('should splice arrays to valid_samples length', async () => {
      mockRepository.saveData.mockResolvedValue(new ProcessedSensorData());

      const input = {
        device_id: 'ESP32_01',
        current_humidity: 55,
        ac_state: true,
        ts_end: 1700000000,
        valid_samples: 2,
        current_temperature: [22, 23, 99],
        desired_temperature: [22, 22, 99],
      } as any;

      await service.processIncomingData(input);

      expect(input.current_temperature).toEqual([22, 23]);
      expect(input.desired_temperature).toEqual([22, 22]);
    });

    it('should set output fields from input', async () => {
      let capturedOutput: ProcessedSensorData | undefined;
      mockStrategies[0].process.mockImplementation(
        (_input: any, output: ProcessedSensorData) => {
          capturedOutput = output;
        },
      );
      mockRepository.saveData.mockResolvedValue(new ProcessedSensorData());

      const input = {
        device_id: 'ESP32_01',
        current_humidity: 60,
        ac_state: false,
        ts_end: 1700000000,
        valid_samples: 1,
        current_temperature: [25],
        desired_temperature: [24],
      } as any;

      await service.processIncomingData(input);

      expect(capturedOutput!.device_id).toBe('ESP32_01');
      expect(capturedOutput!.current_humidity).toBe(60);
      expect(capturedOutput!.ac_state).toBe(false);
      expect(capturedOutput!.ts_end).toEqual(new Date(1700000000 * 1000));
    });

    it('should throw when valid_samples is 0', async () => {
      const input = {
        device_id: 'ESP32_01',
        current_humidity: 55,
        ac_state: true,
        ts_end: 1700000000,
        valid_samples: 0,
        current_temperature: [],
        desired_temperature: [],
      } as any;

      await expect(service.processIncomingData(input)).rejects.toThrow(
        'Invalid Sample',
      );
    });

    it('should apply all strategies', async () => {
      const s1 = { process: jest.fn() };
      const s2 = { process: jest.fn() };
      const s3 = { process: jest.fn() };

      const serviceWithMultiple = new SensorProcessingService(
        [s1, s2, s3] as any,
        mockRepository as any,
      );

      mockRepository.saveData.mockResolvedValue(new ProcessedSensorData());

      const input = {
        device_id: 'ESP32_01',
        current_humidity: 55,
        ac_state: true,
        ts_end: 1700000000,
        valid_samples: 1,
        current_temperature: [22],
        desired_temperature: [22],
      } as any;

      await serviceWithMultiple.processIncomingData(input);

      expect(s1.process).toHaveBeenCalledTimes(1);
      expect(s2.process).toHaveBeenCalledTimes(1);
      expect(s3.process).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveSensorStatus', () => {
    it('should save health sensor data', async () => {
      const saved = new HealthSensorData();
      mockRepository.saveStatus.mockResolvedValue(saved);

      const dto = { device_id: 'ESP32_01', status: true } as any;
      const result = await service.saveSensorStatus(dto);

      expect(mockRepository.saveStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          device_id: 'ESP32_01',
          status: true,
        }),
      );
      expect(result).toBe(saved);
    });
  });
});
