import { Inject, Injectable } from '@nestjs/common';
import { CreateSensorDto } from '../models/dto/create-sensor.dto';
import { ProcessDataStrategy } from '../processing/interfaces/process-data.strategy';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';
import { SensorsRepository } from 'src/repositories/sensors.repository';
import { HealthSensorDto } from 'src/models/dto/health-sensor.dto';
import { HealthSensorData } from 'src/models/entities/health-sensor.entity';

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

  /** applies processing strategies to incoming data (current_temp_stats, desire_temp_mode) */
  async processIncomingData(
    input: CreateSensorDto,
  ): Promise<ProcessedSensorData> {
    const output = new ProcessedSensorData();

    output.device_id = input.device_id;
    output.current_humidity = input.current_humidity;
    output.ac_state = input.ac_state;
    output.ts_end = new Date(input.ts_end * 1000); // parse Unix Timestamp to datetime
    if (input.valid_samples == 0)
      throw new Error(`Invalid Sample: ${JSON.stringify(input)}`);
    input.current_temperature.splice(input.valid_samples);
    input.desired_temperature.splice(input.valid_samples);

    console.log('===========================================');
    console.log("Service ${'sensor/datos'}: ", input);

    this.strategies.forEach((s) => {
      s.process(input, output);
    });

    return this.sensorsRepository.saveData(output);
  }

  async saveSensorStatus(dto: HealthSensorDto): Promise<HealthSensorData> {
    const entity = new HealthSensorData();

    entity.device_id = dto.device_id;
    entity.status = dto.status;
    entity.ts_end = new Date();

    return await this.sensorsRepository.saveStatus(entity);
  }
}
