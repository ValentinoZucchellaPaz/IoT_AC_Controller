import { BaseResponseDto } from './base-response.dto';

// Error
export class SensorErrorResponseDto extends BaseResponseDto<void> {
  success = false;
}
