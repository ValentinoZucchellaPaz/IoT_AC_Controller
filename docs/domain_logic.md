# Lógica de Dominio — Sistema de Control de Aire Acondicionado

## Arquitectura

El backend NestJS implementa una variante simplificada de **Clean Architecture**:

```
Controller → Service → Strategy → Repository → TypeORM → PostgreSQL
```

Las estrategias siguen el patrón **Strategy**, inyectadas via tokens de NestJS.

---

## 1. Estrategias de Procesamiento (Strategy Pattern)

### CurrentTempStatsStrategy

Calcula estadísticas de las temperaturas actuales del lote de muestras:

- `min_temperature` = mínimo del array
- `max_temperature` = máximo del array
- `avg_temperature` = promedio, redondeado a 2 decimales

### DesiredTempModeStrategy

Calcula la **moda** (valor más frecuente) del array `desired_temperature`. En caso de empate, se queda con el primer valor encontrado.

### EfficiencyAnalyzerStrategy

Analiza la eficiencia del sistema en alcanzar la temperatura deseada. Se aplica sobre datos históricos.

**Agrupación**: los períodos se dividen por **temperatura deseada contigua** (cada vez que `desired_temperature` cambia, empieza un nuevo período).

**Lógica por período**:

1. Buscar el primer `ac_state = true` dentro del período
2. Desde ese punto, buscar cuándo `avg_temperature <= desired_temperature` por primera vez
3. Calcular los minutos transcurridos desde el inicio del AC hasta alcanzar la temperatura

**Clasificación**:

| Eficiencia | Tiempo en alcanzar objetivo |
|---|---|
| HIGH_EFFICIENCY (2) | ≤ 10 minutos |
| MEDIUM_EFFICIENCY (1) | ≤ 30 minutos |
| LOW_EFFICIENCY (0) | > 30 minutos o nunca alcanzado |

---

## 2. Servicios

### SensorProcessingService

Punto de entrada para datos entrantes vía MQTT (`sensor/datos`).

1. Setea campos base en `ProcessedSensorData` (device_id, humidity, ac_state, ts_end)
2. Trunca arrays a `valid_samples`
3. Aplica todas las estrategias inyectadas via `INCOMING_SENSOR_DATA_STRATEGIES`
4. Persiste via `SensorsRepository.saveData()`

Lanza error si `valid_samples == 0`.

También procesa `sensor/status` (health checks) via `saveSensorStatus()`.

### ResponseProcessingService

Punto de entrada para respuestas HTTP históricas.

Aplica estrategias de análisis (solo `EfficiencyAnalyzerStrategy`) a los datos históricos recuperados de la DB.

### RetrieveDataService

Intermediario entre controllers y repository:

- `getLastSample()` → `SensorsRepository.findLastData()`
- `getHistorySamples(period)` → calcula rango temporal y llama a `findHistoryData()`
- `getLastStatus()` → `SensorsRepository.findLastStatus()`

### MqttPublisherService

Permite al backend publicar comandos MQTT a dispositivos (ej: cambiar temperatura deseada).

Topic: `devices/{device_id}/command`

Payload: `{"desired_temperature": 22.5}`

---

## 3. Entidades

### ProcessedSensorData (tabla `sensor_readings`)

| Campo | Tipo | Descripción |
|---|---|---|
| id | number (PK) | Autogenerado |
| device_id | string | Identificador del dispositivo |
| ac_state | boolean | Estado del AA |
| desired_temperature | float | Temp deseada (moda del período) |
| min_temperature | float | Temp mínima |
| max_temperature | float | Temp máxima |
| avg_temperature | float | Temp promedio |
| current_humidity | float | Humedad |
| ts_end | timestamptz | Fin del período de muestreo |
| created_at | timestamptz | Fecha de inserción |

### HealthSensorData (tabla `sensor_health`)

| Campo | Tipo | Descripción |
|---|---|---|
| id | number (PK) | Autogenerado |
| device_id | string | Identificador del dispositivo |
| status | boolean | true = online |
| ts_end | timestamptz | Timestamp del heartbeat |

---

## 4. Reglas de Negocio

- **Rango temperatura deseada**: 15–32 °C
- **Histéresis**: ±0.75 °C alrededor de la deseada
- **Frecuencia MQTT**: 1 min (AC on), 5 min (AC off)
- **Buffer máximo**: 20 muestras por publicación
- **Fallback DHT11**: 30.0 °C si el sensor falla
- **IDs de dispositivo**: formato `ESP32_XX` (ej: `ESP32_01`)
