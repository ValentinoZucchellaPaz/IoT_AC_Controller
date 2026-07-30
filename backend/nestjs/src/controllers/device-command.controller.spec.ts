/* eslint-disable */
import { DeviceCommandController } from './device-command.controller';

describe('DeviceCommandController', () => {
  let controller: DeviceCommandController;
  let mockMqttPublisher: { publish: jest.Mock };

  beforeEach(() => {
    mockMqttPublisher = { publish: jest.fn() };
    controller = new DeviceCommandController(mockMqttPublisher as any);
  });

  it('should publish temperature command via MQTT', () => {
    const dto = { device_id: 'ESP32_01', desired_temperature: 22.5 };

    const result = controller.sendCommand(dto);

    expect(mockMqttPublisher.publish).toHaveBeenCalledWith('ESP32_01', {
      desired_temperature: 22.5,
    });
    expect(result).toEqual({
      success: true,
      message: 'Temperature command published to ESP32_01',
    });
  });

  it('should work with different device and temperature', () => {
    const dto = { device_id: 'ESP32_02', desired_temperature: 25 };

    const result = controller.sendCommand(dto);

    expect(mockMqttPublisher.publish).toHaveBeenCalledWith('ESP32_02', {
      desired_temperature: 25,
    });
    expect(result.message).toContain('ESP32_02');
  });
});
