/* eslint-disable */
import { SensorsController } from './sensors.controller';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';
import { HealthSensorDto } from '../models/dto/health-sensor.dto';
import { ProcessedSensorData } from '../models/entities/processed-sensor.entity';
import { HealthSensorData } from '../models/entities/health-sensor.entity';

describe('SensorsController', () => {
  let controller: SensorsController;
  let mockProcessor: {
    processIncomingData: jest.Mock;
    saveSensorStatus: jest.Mock;
  };

  beforeEach(() => {
    mockProcessor = {
      processIncomingData: jest.fn(),
      saveSensorStatus: jest.fn(),
    };

    controller = new SensorsController(mockProcessor as any);
  });

  describe('handleSensorData', () => {
    it('should process incoming sensor data', async () => {
      const dto = new CreateSensorDto();
      Object.assign(dto, {
        device_id: 'ESP32_01',
        ac_state: true,
        desired_temperature: [22],
        current_temperature: [23],
        valid_samples: 1,
        current_humidity: 50,
        ts_end: 1700000000,
      });

      mockProcessor.processIncomingData.mockResolvedValue(
        new ProcessedSensorData(),
      );

      await controller.handleSensorData(dto);

      expect(mockProcessor.processIncomingData).toHaveBeenCalledWith(dto);
    });

    it('should not throw when processing fails', async () => {
      const dto = new CreateSensorDto();
      Object.assign(dto, {
        device_id: 'ESP32_01',
        ac_state: true,
        desired_temperature: [22],
        current_temperature: [23],
        valid_samples: 1,
        current_humidity: 50,
        ts_end: 1700000000,
      });

      mockProcessor.processIncomingData.mockRejectedValue(
        new Error('processing error'),
      );

      await expect(controller.handleSensorData(dto)).resolves.toBeUndefined();
    });
  });

  describe('handleSensorStatus', () => {
    it('should process incoming sensor status', async () => {
      const dto = new HealthSensorDto();
      Object.assign(dto, {
        device_id: 'ESP32_01',
        status: true,
      });

      mockProcessor.saveSensorStatus.mockResolvedValue(new HealthSensorData());

      await controller.handleSensorStatus(dto);

      expect(mockProcessor.saveSensorStatus).toHaveBeenCalledWith(dto);
    });

    it('should not throw when status processing fails', async () => {
      const dto = new HealthSensorDto();
      Object.assign(dto, {
        device_id: 'ESP32_01',
        status: true,
      });

      mockProcessor.saveSensorStatus.mockRejectedValue(new Error('db error'));

      await expect(controller.handleSensorStatus(dto)).resolves.toBeUndefined();
    });
  });
});
