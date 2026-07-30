# Arquitectura del Sistema

```
┌──────────────┐     MQTT      ┌──────────────┐     HTTP      ┌──────────────┐
│              │ ──────────►   │              │ ◄───────────  │              │
│    ESP32     │  sensor/datos │   NestJS     │  /data/last   │   Next.js    │
│  (firmware)  │ ◄──────────── │   Backend    │  /data/history│  Dashboard   │
│              │  devices/{id} │   :3000      │  /devices/cmd │   :3001      │
└──────────────┘   /command    └──────┬───────┘  /health      └──────────────┘
                                      │
                                      │ TypeORM
                                      ▼
                               ┌──────────────┐
                               │  PostgreSQL   │
                               │  :5433        │
                               └──────────────┘
```

## Capas

### Firmware (ESP32)

- Proyecto **PlatformIO** con framework Arduino
- Sensor **DHT11** de temperatura y humedad
- Botones físicos UP/DOWN para ajustar temperatura deseada
- Botón POWER para encender/apagar el AA
- LED verde simula relay de cooling
- Publica en `sensor/datos` y `sensor/status` vía MQTT
- Se suscribe a `devices/{id}/command` para comandos remotos
- Histéresis de ±0.75°C para estabilidad del compresor

### Backend (NestJS)

- **Microservicio MQTT** via `@nestjs/microservices` — suscrito a `sensor/datos` y `sensor/status`
- **API REST** (Express) en puerto 3000: `/data/last`, `/data/history/{period}`, `/devices/command`, `/health`
- **Patrón Strategy** para procesamiento: `CurrentTempStatsStrategy`, `DesiredTempModeStrategy`, `EfficiencyAnalyzerStrategy`
- **TypeORM** con PostgreSQL (tablas `sensor_readings`, `sensor_health`)
- **Swagger** en `/api`
- **MqttPublisherService** publica comandos a los dispositivos

### Frontend (Next.js)

- App Router con componentes shadcn/ui
- Gráficos de temperatura/humedad en tiempo real (Recharts)
- Barras de eficiencia con detección de períodos
- AlertBadge para estado de conectividad y del AA
- Proxy `/api/*` → backend via `next.config.js`

### Infraestructura (Docker)

- `postgres:16-alpine` en puerto host `5433`
- `eclipse-mosquitto:2` (broker MQTT) en puerto host `1883`
