import { IsBoolean, IsString } from 'class-validator';

export class HealthSensorDto {
  @IsString()
  device_id!: string;

  @IsBoolean()
  status!: boolean;
}
