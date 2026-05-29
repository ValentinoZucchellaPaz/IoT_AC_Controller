import { Inject, Injectable } from '@nestjs/common';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';
import { ProcessDataStrategy } from '../processing/interfaces/process-data.strategy';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { SensorsRepository } from 'src/repositories/sensors.repository';

export const INCOMING_SENSOR_DATA_STRATEGIES =
  'INCOMING_SENSOR_DATA_STRATEGIES';

@Injectable()
export class SensorProcessingService {
  constructor(
    @Inject(INCOMING_SENSOR_DATA_STRATEGIES)
    private readonly strategies: ProcessDataStrategy<
      CreateSensorDto,
      ProcessedSensorData
    >[],

    private readonly sensorsRepository: SensorsRepository,
  ) {}

  async processIncomingData(
    input: CreateSensorDto,
  ): Promise<ProcessedSensorData> {
    const output = new ProcessedSensorData();

    output.device_id = input.device_id;
    output.ac_state = input.ac_state;
    output.ts_end = input.ts_end;

    this.strategies.forEach((s) => {
      s.process(input, output);
    });

    return await this.sensorsRepository.save(output);
  }
}
