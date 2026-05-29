import { BaseResponseDto } from './base-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { HistoryReadingsDto } from '../history-readings.dto';

// OK - history query
export class SensorHistoryResponseDto extends BaseResponseDto<HistoryReadingsDto> {
  success = true;

  @ApiProperty()
  total!: number; // total of db registers returned
}
