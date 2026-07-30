/* eslint-disable */
jest.mock('mqtt', () => ({
  connect: jest.fn(),
}));

import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttPublisherService } from './mqtt-publisher.service';
import * as mqtt from 'mqtt';

describe('MqttPublisherService', () => {
  let service: MqttPublisherService;
  let mockClient: { publish: jest.Mock; on: jest.Mock; end: jest.Mock };

  function createService(url?: string) {
    const config = {
      get: jest.fn().mockReturnValue(url ?? 'mqtt://localhost:1883'),
    };

    mockClient = {
      publish: jest.fn(),
      on: jest.fn(),
      end: jest.fn(),
    };

    (mqtt.connect as jest.Mock).mockReturnValue(mockClient);

    return new MqttPublisherService(config as any);
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('publish', () => {
    it('should connect to MQTT and publish command', () => {
      service = createService();

      service.publish('ESP32_01', { desired_temperature: 22.5 });

      expect(mqtt.connect).toHaveBeenCalledWith('mqtt://localhost:1883');
      expect(mockClient.publish).toHaveBeenCalledWith(
        'devices/ESP32_01/command',
        '{"desired_temperature":22.5}',
      );
    });

    it('should use custom MQTT URL from config', () => {
      service = createService('mqtt://broker:1883');

      service.publish('device-1', { key: 'value' });

      expect(mqtt.connect).toHaveBeenCalledWith('mqtt://broker:1883');
    });

    it('should reuse existing client on subsequent publishes', () => {
      service = createService();

      service.publish('d1', {});
      service.publish('d2', {});

      expect(mqtt.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.publish).toHaveBeenCalledTimes(2);
    });

    it('should handle config returning undefined (fallback to default)', () => {
      service = createService();

      service.publish('d1', { x: 1 });

      expect(mqtt.connect).toHaveBeenCalledWith('mqtt://localhost:1883');
    });

    it('should register error handler on client', () => {
      service = createService();

      service.publish('d1', {});

      expect(mockClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('onModuleDestroy', () => {
    it('should end the MQTT client if it exists', () => {
      service = createService();
      service.publish('d1', {});

      service.onModuleDestroy();

      expect(mockClient.end).toHaveBeenCalledTimes(1);
    });

    it('should not throw if client was never created', () => {
      service = createService();

      expect(() => service.onModuleDestroy()).not.toThrow();
    });
  });
});
