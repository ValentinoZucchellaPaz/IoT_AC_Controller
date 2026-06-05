import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';

@Injectable()
export class SensorsRepository {
  constructor(
    @InjectRepository(ProcessedSensorData)
    private readonly repo: Repository<ProcessedSensorData>,
  ) {}

  async save(dto: ProcessedSensorData): Promise<ProcessedSensorData> {
    return this.repo.save(dto);
  }

  async findLast(): Promise<ProcessedSensorData | null> {
    return this.repo.findOne({
      where: {},
      order: {
        ts_end: 'DESC',
      },
    });
  }

  async findHistory(
    fromTs: number,
    toTs: number,
  ): Promise<ProcessedSensorData[]> {
    return this.repo.find({
      where: {
        ts_end: Between(new Date(fromTs * 1000), new Date(toTs * 1000)),
      },
      order: {
        ts_end: 'ASC',
      },
    });
  }

  // TODO: get last query, get history queries
}
