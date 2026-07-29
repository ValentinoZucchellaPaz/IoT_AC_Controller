import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TemperatureCommandDto } from 'src/models/dto/command/temperature-command.dto';
import { MqttPublisherService } from 'src/services/mqtt-publisher.service';

@ApiTags('Device Commands')
@Controller('devices')
export class DeviceCommandController {
  private readonly logger = new Logger(DeviceCommandController.name);

  constructor(private readonly mqttPublisher: MqttPublisherService) {}

  @ApiOperation({
    summary: 'Send temperature command',
    description:
      'Publishes a desired temperature command to a device via MQTT.',
  })
  @Post('command')
  sendCommand(@Body(new ValidationPipe()) dto: TemperatureCommandDto): {
    success: boolean;
    message: string;
  } {
    this.mqttPublisher.publish(dto.device_id, {
      desired_temperature: dto.desired_temperature,
    });

    this.logger.log(
      `Command sent to ${dto.device_id}: temp=${dto.desired_temperature}`,
    );

    return {
      success: true,
      message: `Temperature command published to ${dto.device_id}`,
    };
  }
}
