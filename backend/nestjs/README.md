# Backend NestJS — Sistema de Climatización IoT

## Stack

- **NestJS 11** con Express
- **TypeORM** + PostgreSQL
- **MQTT microservice** (`@nestjs/microservices`)
- **Swagger** en `/api`

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Desarrollo con watch |
| `npm test` | Tests unitarios (Jest, 65 tests, 12 suites) |
| `npm run lint` | ESLint + Prettier |
| `npm run mqtt:seed` | Publica datos MQTT falsos para pruebas offline |
| `npm run build` | Compilar a `dist/` |

## Puertos

- API REST: `3000`
- Swagger: http://localhost:3000/api
- PostgreSQL: `5433` (host) via Docker
- MQTT broker: `1883` via Docker

## Estructura

```
src/
├── controllers/          # REST + MQTT event handlers
│   ├── sensors.controller.ts        # MQTT: sensor/datos, sensor/status
│   ├── data.controller.ts           # GET /data/last, /data/history/{period}
│   ├── device-command.controller.ts # POST /devices/command
│   └── health.controller.ts         # GET /health
├── services/             # Lógica de negocio
│   ├── sensor-processing.service.ts
│   ├── response-processing.service.ts
│   ├── retrieve-data.service.ts
│   └── mqtt-publisher.service.ts
├── processing/           # Strategy pattern
│   └── strategies/
│       ├── current-temp-stats.strategy.ts
│       ├── desired-temp-mode.strategy.ts
│       └── efficiency-analyzer.strategy.ts
├── repositories/         # TypeORM repositories
│   └── sensors.repository.ts
└── models/               # DTOs + Entities
    ├── dto/
    └── entities/
```

## Estrategias de procesamiento

1. **CurrentTempStatsStrategy** — min, max, avg de temperaturas actuales
2. **DesiredTempModeStrategy** — moda de temperatura deseada
3. **EfficiencyAnalyzerStrategy** — eficiencia por períodos contiguos de misma temperatura deseada

## Tests

```bash
npm test              # 65 tests, 12 suites
npm run test:cov      # con cobertura (threshold 80%)
```

Los tests usan mocks y no requieren base de datos ni MQTT.
