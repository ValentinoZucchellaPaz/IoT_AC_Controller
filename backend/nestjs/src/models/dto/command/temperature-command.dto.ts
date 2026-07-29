import { IsNumber, IsString, Min, Max } from 'class-validator';

export class TemperatureCommandDto {
  @IsString()
  device_id!: string;

  @IsNumber()
  @Min(15)
  @Max(32)
  desired_temperature!: number;
}
