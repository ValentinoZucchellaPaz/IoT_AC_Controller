import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  // TODO: get last query, get history queries
}
