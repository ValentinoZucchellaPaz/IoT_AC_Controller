import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from '../../models/dto/create-sensor.dto';
import { ProcessDataStrategy } from '../interfaces/process-data.strategy';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';

@Injectable()
export class CurrentTempStatsStrategy implements ProcessDataStrategy<
  CreateSensorDto,
  ProcessedSensorData
> {
  readonly name = 'current-temperature-stats';

  process(input: CreateSensorDto, output: ProcessedSensorData) {
    const temperatures = input.current_temperature;

    output.min_temperature = Math.min(...temperatures);

    output.max_temperature = Math.max(...temperatures);

    output.avg_temperature =
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    output.avg_temperature = Number(output.avg_temperature.toFixed(2));
  }
}
