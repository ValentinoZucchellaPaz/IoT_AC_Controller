# Especificación de la API REST y Payloads MQTT

La documentación interactiva de la API está disponible via Swagger en:

> **http://localhost:3000/api** (con el backend corriendo)

---

## Payload MQTT — ESP32 → Backend

### Topic: `sensor/datos`

Payload:

```json
{
  "device_id": "ESP32_01",
  "ac_state": true,
  "desired_temperature": [22.0, 22.5, 23.0],
  "current_temperature": [23.4, 22.8, 22.5],
  "valid_samples": 3,
  "current_humidity": 55.0,
  "ts_end": 1780617600
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| device_id | string | Identificador único del dispositivo |
| ac_state | boolean | Estado del aire acondicionado |
| desired_temperature | number[] | Temperaturas objetivo registradas |
| current_temperature | number[] | Temperaturas medidas |
| valid_samples | number | Cantidad de muestras válidas |
| current_humidity | number | Humedad actual |
| ts_end | number | Unix Timestamp (seg) del fin del período |

---

## Respuestas HTTP

Todas las respuestas siguen la estructura base:

```json
{
  "success": true,
  "message": "ok",
  "timestamp": "2026-06-05T18:59:35.032Z"
}
```

### ErrorResponseDTO — sin datos

```json
{
  "success": false,
  "message": "No data available",
  "error": {
    "code": "NO_CONTENT",
    "detail": "No sensor data found"
  },
  "timestamp": "2026-06-02T07:47:46.746Z"
}
```

---

## GET /data/last

Última muestra procesada + estado de conectividad.

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "sensor": {
      "device_id": "ESP32_01",
      "ac_state": false,
      "desired_temperature": 22,
      "min_temperature": 27,
      "max_temperature": 27,
      "avg_temperature": 27,
      "current_humidity": 55,
      "ts_end": "2026-06-01T04:25:00.000Z"
    },
    "connectivity": {
      "status": true,
      "ts_end": "2026-06-01T04:25:00.000Z"
    }
  },
  "timestamp": "2026-06-02T07:47:46.746Z"
}
```

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| data.sensor.device_id | string | Dispositivo |
| data.sensor.ac_state | boolean | Estado del AA |
| data.sensor.desired_temperature | number | Temperatura deseada (moda del período) |
| data.sensor.min_temperature | number | Mínima del período |
| data.sensor.max_temperature | number | Máxima del período |
| data.sensor.avg_temperature | number | Promedio del período |
| data.sensor.current_humidity | number | Humedad |
| data.sensor.ts_end | string (ISO) | Fin del período |
| data.connectivity.status | boolean | true = online |
| data.connectivity.ts_end | string (ISO) | Último heartbeat |

---

## GET /data/history/{period}

Períodos válidos: `1h`, `6h`, `12h`, `1d`, `3d`, `7d`

```json
{
  "success": true,
  "message": "ok",
  "total": 17,
  "data": {
    "samples": [
      {
        "id": 1,
        "device_id": "ESP32_01",
        "ac_state": true,
        "desired_temperature": 22,
        "min_temperature": 22,
        "max_temperature": 28,
        "avg_temperature": 24,
        "current_humidity": 55,
        "ts_end": "2026-06-01T03:10:00.000Z",
        "created_at": "2026-06-02T10:09:38.092Z"
      }
    ],
    "period_efficiency": [
      {
        "from": "2026-06-01T03:10:00.000Z",
        "to": "2026-06-01T03:20:00.000Z",
        "efficiency": 0
      }
    ]
  },
  "timestamp": "2026-06-02T07:47:34.684Z"
}
```

### EfficiencyEnum

| Valor | Significado | Criterio |
|---|---|---|
| 0 | LOW_EFFICIENCY | > 30 min o nunca alcanzó la temperatura deseada |
| 1 | MEDIUM_EFFICIENCY | Entre 10 y 30 min |
| 2 | HIGH_EFFICIENCY | ≤ 10 min |

Los períodos de eficiencia se agrupan por **temperatura deseada contigua** (no por estado del AC).

---

## POST /devices/command

Envía un comando de temperatura a un dispositivo vía MQTT.

```http
POST /devices/command
Content-Type: application/json

{
  "device_id": "ESP32_01",
  "desired_temperature": 22.5
}
```

Respuesta:

```json
{
  "success": true,
  "message": "Temperature command published to ESP32_01"
}
```

Validación: `desired_temperature` debe estar entre 15 y 32.

---

## GET /health

Health check del backend.

```json
{
  "status": "ok",
  "timestamp": "2026-07-29T12:00:00.000Z",
  "uptime": 12345
}
```
