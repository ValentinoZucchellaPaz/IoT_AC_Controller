import { Injectable } from '@nestjs/common';
import { ProcessDataStrategy } from '../interfaces/process-data.strategy';
import { CreateSensorDto } from 'src/models/dto/create-sensor.dto';
import { ProcessedSensorData } from 'src/models/entities/processed-sensor.entity';

@Injectable()
export class DesiredTempModeStrategy implements ProcessDataStrategy<
  CreateSensorDto,
  ProcessedSensorData
> {
  readonly name = 'desired-temperature-mode';

  process(input: CreateSensorDto, output: ProcessedSensorData) {
    const temperatures = input.desired_temperature;

    const frequency = new Map<number, number>();

    for (const temperature of temperatures) {
      const currentCount = frequency.get(temperature) ?? 0;

      frequency.set(temperature, currentCount + 1);
    }

    let mode = temperatures[0];
    let maxCount = 0;

    for (const [temperature, count] of frequency.entries()) {
      if (count > maxCount) {
        mode = temperature;
        maxCount = count;
      }
    }

    output.desired_temperature = mode;
  }
}
