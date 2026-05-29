import { registerAs } from '@nestjs/config';

export default registerAs('mqtt', () => ({
  url: process.env.MQTT_URL ?? 'mqtt://localhost:1883',
}));
