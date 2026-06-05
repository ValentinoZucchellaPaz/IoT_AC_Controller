# Payload MQTT (ESP32 → Backend)

Topic:

```text
sensor/datos
```

Payload:

```json
{
  "device_id": "ESP32_01",
  "ac_state": true,
  "desired_temperature": [22.0, 22.5, 23.0],
  "current_temperature": [23.4, 22.8, 22.5],
  "valid_samples": 3,
  "ts_end": 1780617600
}
```

Campos:

| Campo               | Tipo     | Descripción                                                               |
| ------------------- | -------- | ------------------------------------------------------------------------- |
| device_id           | string   | Identificador único del dispositivo                                       |
| ac_state            | boolean  | Estado del aire acondicionado                                             |
| desired_temperature | number[] | Temperaturas objetivo registradas durante el período                      |
| current_temperature | number[] | Temperaturas medidas durante el período                                   |
| valid_samples       | number   | Cantidad de muestras válidas                                              |
| ts_end              | number   | Unix Timestamp (segundos) correspondiente al final del período muestreado |

---

# Respuestas HTTP

Todas las respuestas siguen la misma estructura base:

```json
{
  "success": true,
  "message": "ok",
  "timestamp": "2026-06-05T18:59:35.032Z"
}
```

## ErrorResponseDTO

Se devuelve cuando ocurre un error de validación o procesamiento.

Ejemplo:

```json
{
  "success": false,
  "timestamp": "2026-06-05T18:59:35.032Z",
  "error": {
    "code": 400,
    "message": "Validation failed (enum string is expected)"
  },
  "path": "/data/history/8"
}
```

Campos:

| Campo         | Tipo    | Descripción                  |
| ------------- | ------- | ---------------------------- |
| success       | boolean | Siempre false                |
| timestamp     | string  | Fecha y hora de la respuesta |
| error.code    | number  | Código HTTP                  |
| error.message | string  | Descripción del error        |
| path          | string  | Endpoint solicitado          |

---

## SensorResponseDTO

Devuelve la última muestra procesada almacenada en la base de datos.

Endpoint:

```http
GET /data/last
```

Ejemplo:

```json
{
  "success": true,
  "message": "ok",
  "data": {
    "id": 14,
    "device_id": "ESP32_01",
    "ac_state": false,
    "desired_temperature": 22,
    "min_temperature": 27,
    "max_temperature": 27,
    "avg_temperature": 27,
    "ts_end": "2026-06-01T04:25:00.000Z",
    "created_at": "2026-06-02T10:09:38.092Z"
  },
  "timestamp": "2026-06-02T07:47:46.746Z"
}
```

### ProcessedSensorData

| Campo               | Tipo    | Descripción                            |
| ------------------- | ------- | -------------------------------------- |
| id                  | number  | Identificador autogenerado             |
| device_id           | string  | Dispositivo que generó la muestra      |
| ac_state            | boolean | Estado del aire acondicionado          |
| desired_temperature | number  | Temperatura deseada procesada          |
| min_temperature     | number  | Temperatura mínima del período         |
| max_temperature     | number  | Temperatura máxima del período         |
| avg_temperature     | number  | Temperatura promedio del período       |
| ts_end              | Date    | Fin del período muestreado             |
| created_at          | Date    | Fecha de inserción en la base de datos |

---

## SensorHistoryResponseDTO

Devuelve muestras históricas junto con el análisis de eficiencia realizado por el backend.

Endpoint:

```http
GET /data/history/{period}
```

Ejemplo:

```json
{
  "success": true,
  "message": "ok",
  "timestamp": "2026-06-02T07:47:34.684Z",
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
        "ts_end": "2026-06-01T03:10:00.000Z",
        "created_at": "2026-06-02T10:09:38.092Z"
      }
    ],
    "period_efficency": [
      {
        "from": "2026-06-01T03:10:00.000Z",
        "to": "2026-06-01T03:20:00.000Z",
        "efficency": 2
      }
    ]
  }
}
```

Campos adicionales:

| Campo                 | Tipo                  | Descripción                           |
| --------------------- | --------------------- | ------------------------------------- |
| total                 | number                | Cantidad de registros recuperados     |
| data.samples          | ProcessedSensorData[] | Muestras históricas                   |
| data.period_efficency | EfficiencyPeriod[]    | Períodos de funcionamiento detectados |

### EfficiencyPeriod

| Campo     | Tipo   | Descripción                           |
| --------- | ------ | ------------------------------------- |
| from      | Date   | Inicio del período con AC encendido   |
| to        | Date   | Fin del período con AC encendido      |
| efficency | number | Clasificación de eficiencia calculada |

### EfficiencyEnum

| Valor | Significado       |
| ----- | ----------------- |
| 0     | HIGH_EFFICIENCY   |
| 1     | MEDIUM_EFFICIENCY |
| 2     | LOW_EFFICIENCY    |

---

## Períodos válidos para consultas históricas

```text
1h
6h
12h
1d
3d
7d
```

Ejemplo:

```http
GET /data/history/7d
```

Una mejora a futuro es cambiar `efficency: 0/1/2` por `"HIGH"`, `"MEDIUM"`, `"LOW"` en la API.
