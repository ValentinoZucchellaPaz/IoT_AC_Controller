import { BaseResponseDto } from './base-response.dto';
import { HistoryReadingsDto } from '../history-readings.dto';

// OK - history query
export class SensorHistoryResponseDto extends BaseResponseDto<HistoryReadingsDto> {
  total: number;

  constructor(total: number, data: HistoryReadingsDto, message: string) {
    super();

    this.success = true;
    this.total = total;
    this.data = data;
    this.message = message;
  }
}
