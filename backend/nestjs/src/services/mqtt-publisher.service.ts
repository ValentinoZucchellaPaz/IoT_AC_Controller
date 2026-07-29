import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';

@Injectable()
export class MqttPublisherService implements OnModuleDestroy {
  private readonly logger = new Logger(MqttPublisherService.name);
  private client: MqttClient | null = null;
  private readonly mqttUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.mqttUrl =
      this.configService.get<string>('mqtt.url') ?? 'mqtt://localhost:1883';
  }

  private ensureClient(): MqttClient {
    if (!this.client) {
      this.client = mqtt.connect(this.mqttUrl);
      this.client.on('error', (err) => {
        this.logger.error('MQTT publisher error', err.message);
      });
    }
    return this.client;
  }

  publish(deviceId: string, payload: Record<string, unknown>): void {
    const topic = `devices/${deviceId}/command`;
    const message = JSON.stringify(payload);
    this.ensureClient().publish(topic, message);
    this.logger.log(`Published to ${topic}: ${message}`);
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }
}
