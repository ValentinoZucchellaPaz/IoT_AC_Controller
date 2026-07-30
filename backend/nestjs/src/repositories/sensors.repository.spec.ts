/* eslint-disable */
import { SensorsRepository } from './sensors.repository';
import { ProcessedSensorData } from '../models/entities/processed-sensor.entity';
import { HealthSensorData } from '../models/entities/health-sensor.entity';

describe('SensorsRepository', () => {
  let repository: SensorsRepository;
  let mockDataRepo: {
    save: jest.Mock;
    findOne: jest.Mock;
    find: jest.Mock;
  };
  let mockHealthRepo: {
    save: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(() => {
    mockDataRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };
    mockHealthRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    repository = new SensorsRepository(
      mockDataRepo as any,
      mockHealthRepo as any,
    );
  });

  describe('saveData', () => {
    it('should delegate to dataRepo.save', async () => {
      const entity = new ProcessedSensorData();
      mockDataRepo.save.mockResolvedValue(entity);

      const result = await repository.saveData(entity);

      expect(mockDataRepo.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findLastData', () => {
    it('should return last data ordered by ts_end DESC', async () => {
      const entity = new ProcessedSensorData();
      mockDataRepo.findOne.mockResolvedValue(entity);

      const result = await repository.findLastData();

      expect(mockDataRepo.findOne).toHaveBeenCalledWith({
        where: {},
        order: { ts_end: 'DESC' },
      });
      expect(result).toBe(entity);
    });

    it('should return null when no data exists', async () => {
      mockDataRepo.findOne.mockResolvedValue(null);

      const result = await repository.findLastData();

      expect(result).toBeNull();
    });
  });

  describe('findHistoryData', () => {
    it('should delegate to dataRepo.find with Between', async () => {
      const entities = [new ProcessedSensorData()];
      mockDataRepo.find.mockResolvedValue(entities);

      const result = await repository.findHistoryData(1000, 2000);

      expect(mockDataRepo.find).toHaveBeenCalledWith({
        where: {
          ts_end: expect.any(Object),
        },
        order: { ts_end: 'ASC' },
      });
      expect(result).toBe(entities);
    });
  });

  describe('saveStatus', () => {
    it('should delegate to healthRepo.save', async () => {
      const entity = new HealthSensorData();
      mockHealthRepo.save.mockResolvedValue(entity);

      const result = await repository.saveStatus(entity);

      expect(mockHealthRepo.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findLastStatus', () => {
    it('should return last status ordered by ts_end DESC', async () => {
      const entity = new HealthSensorData();
      mockHealthRepo.findOne.mockResolvedValue(entity);

      const result = await repository.findLastStatus();

      expect(mockHealthRepo.findOne).toHaveBeenCalledWith({
        where: {},
        order: { ts_end: 'DESC' },
      });
      expect(result).toBe(entity);
    });

    it('should return null when no status exists', async () => {
      mockHealthRepo.findOne.mockResolvedValue(null);

      const result = await repository.findLastStatus();

      expect(result).toBeNull();
    });
  });
});
