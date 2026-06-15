import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { HealthSensorData } from 'src/models/entities/health-sensor.entity';

@Injectable()
export class SensorsRepository {
  constructor(
    @InjectRepository(ProcessedSensorData)
    private readonly dataRepo: Repository<ProcessedSensorData>,
    @InjectRepository(HealthSensorData)
    private readonly healthRepo: Repository<HealthSensorData>,
  ) {}

  async saveData(dto: ProcessedSensorData): Promise<ProcessedSensorData> {
    return this.dataRepo.save(dto);
  }

  async findLastData(): Promise<ProcessedSensorData | null> {
    return this.dataRepo.findOne({
      where: {},
      order: {
        ts_end: 'DESC',
      },
    });
  }

  async findHistoryData(
    fromTs: number,
    toTs: number,
  ): Promise<ProcessedSensorData[]> {
    return this.dataRepo.find({
      where: {
        ts_end: Between(new Date(fromTs * 1000), new Date(toTs * 1000)),
      },
      order: {
        ts_end: 'ASC',
      },
    });
  }

  async saveStatus(dto: HealthSensorData): Promise<HealthSensorData> {
    return this.healthRepo.save(dto);
  }

  async findLastStatus(): Promise<HealthSensorData | null> {
    return this.healthRepo.findOne({
      where: {},
      order: {
        ts_end: 'DESC',
      },
    });
  }
}
