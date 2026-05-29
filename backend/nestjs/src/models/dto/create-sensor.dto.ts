import {
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateSensorDto {
  @IsString()
  device_id!: string;

  @IsBoolean()
  ac_state!: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  desired_temperature!: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  current_temperature!: number[];

  @IsNumber()
  valid_samples!: number;

  @IsNumber()
  ts_end!: number;
}
