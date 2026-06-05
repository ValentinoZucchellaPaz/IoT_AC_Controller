import { BaseResponseDto } from './base-response.dto';

// Error
export class SensorErrorResponseDto extends BaseResponseDto<void> {
  constructor(errorCode: string, errorDetail: string, message: string) {
    super();

    this.success = false;
    this.error = { code: errorCode, detail: errorDetail };
    this.message = message;
  }
}
