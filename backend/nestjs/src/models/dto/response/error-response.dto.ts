import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty()
  code!: string; // e.g. 'SENSOR_NOT_FOUND'

  @ApiProperty()
  detail!: string;
}
