# Topics MQTT

## ESP32 → Backend

| Topic | QoS | Retained | Payload | Frecuencia |
|---|---|---|---|---|
| `sensor/datos` | 1 | No | [batch de sensores](#sensordatos) | Cada 60s (AC encendido) o 300s (AC apagado) |
| `sensor/status` | 1 | Sí | [estado de conexión](#sensorstatus) | Al iniciar y al reconectar |

### sensor/datos

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

### sensor/status

```json
{
  "device_id": "ESP32_01",
  "status": true
}
```

`status: true` = dispositivo conectado (WiFi + MQTT). Se publica al iniciar y al reconectar. `status: false` se envía automáticamente via LWT (Last Will and Testament) cuando el dispositivo se desconecta inesperadamente.

---

## Backend → ESP32

| Topic | QoS | Retained | Payload |
|---|---|---|---|
| `devices/{device_id}/command` | 1 | No | [comando](#devicesdevice_idcommand) |

### devices/{device_id}/command

```json
{
  "desired_temperature": 22.5
}
```

El ESP32 recibe esto vía suscripción MQTT y actualiza su temperatura objetivo. El valor es **float** (se parsea con `is<float>()` en el firmware).
