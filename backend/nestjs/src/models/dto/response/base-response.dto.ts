import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class BaseResponseDto<T = void> {
  @ApiProperty()
  success!: boolean;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional()
  error?: ErrorResponseDto;

  @ApiProperty()
  timestamp: string = new Date().toISOString();
}
