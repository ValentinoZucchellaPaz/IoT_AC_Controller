import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';

class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string = 'ok';

  @ApiProperty({ example: '2026-07-29T12:00:00.000Z' })
  timestamp: string = new Date().toISOString();

  @ApiProperty({ example: 12345 })
  uptime: number = process.uptime();
}

@ApiTags('Health')
@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @ApiOperation({
    summary: 'Health check',
    description:
      'Returns the current health status of the API including uptime and server timestamp.',
  })
  @Get('health')
  check(): HealthResponseDto {
    this.logger.log('Health check requested');
    return new HealthResponseDto();
  }
}
