# Especificación de la Lógica de Dominio – Sistema de Control de Aire Acondicionado

Este documento define las reglas de negocio, algoritmos y patrones de diseño que residen en el dominio del sistema. Esta capa representa el modelo lógico del aire acondicionado, diseñado para ser independiente de cualquier detalle de implementación externa (HTTP, base de datos, WebSockets, frontend).

## 1. Entidad principal: ProcessedSensor

### 1.1. ProcessedSensor
Representa el estado consolidado del entorno e indicadores calculados en un intervalo de tiempo.
- **Atributos:** `device_id` (string), `ac_state` (boolean), `desired_temperature` (16-30°C), `avg_temperature` (-10 a 50°C), `humidity` (number), `ts_end` (number(timestamp)).
- **Invariantes:** La entidad es autovalidante en su constructor de dominio. 

### 1.2. Regla de Frecuencia de Muestreo (Mantenimiento de Estado)
El dispositivo físico (ESP32) regula el envío de cargas útiles hacia el dominio en función de su estado operativo actual para optimizar el consumo de red y el almacenamiento:
- **Estado Encendido (`ac_state: true`):** El intervalo de publicación de lecturas al broker MQTT es estrictamente de **1 minuto**.
- **Estado Apagado (`ac_state: false`):** El intervalo de publicación se relaja a **5 minutos**, actuando como un latido de corazón (*heartbeat*) para certificar la vitalidad del hardware sin saturar la persistencia.

### 2. Algoritmos de Procesamiento (Estrategias)

El sistema procesa las ráfagas de datos crudos provenientes del broker MQTT mediante algoritmos encapsulados que analizan las tendencias del dispositivo:

### 2.1. Análisis de Eficiencia (`EfficiencyAnalyzerStrategy`)
- **Propósito:** Evaluar la velocidad y capacidad de respuesta del equipo de climatización para alcanzar el objetivo deseado, clasificando el rendimiento del compresor en niveles discretos (High, Medium, Low Efficiency).

### 2.2. Estadísticas de Temperatura Actual (`CurrentTempStatsStrategy`)
- **Propósito:** Calcular promedios ponderados y desviaciones térmicas en tiempo real a partir de las muestras enviadas por los sensores analógicos del hardware.

### 2.3. Modo de Temperatura Deseada (`DesiredTempModeStrategy`)
- **Propósito:** Evaluar consistencias, cambios de comportamiento del usuario y la persistencia de las consignas térmicas fijadas en el dispositivo.


## 3. Patrones de Diseño

### 3.1. Observer

Permite que el dominio sea reactivo y extienda su funcionalidad sin modificar el núcleo.

### 3.2. Strategy

Se aplica para dar flexibilidad al procesamiento de los datos históricos.

- *Interfaz:* FilterStrategy { filter(history: ReadingData[]): ReadingData[] }

- *Estrategias concretas:*

- OnlyOnFilter: Procesa únicamente lecturas donde el AC estuvo encendido.

- LastNFilter: Considera solo las últimas N lecturas para cálculos de corto plazo.

- *Uso:* El algoritmo de detección de anomalías utiliza estas estrategias para decidir qué porción del historial es relevante para el análisis actual.

## 4. Servicio de Dominio 

Es el punto de entrada a la lógica de negocio que coordina las entidades, los repositorios y los patrones de comportamiento.

- **`SensorProcessingService` (`processIncomingData`):**
  - Recibe la carga útil del sensor (`CreateSensorDto`) transmitida por la capa de conectividad MQTT.
  - Ejecuta de forma secuencial y polimórfica mediante un ciclo `forEach` las estrategias de análisis inyectadas bajo el contrato `ProcessDataStrategy<I, O>`.
  - Transforma las lecturas crudas en la estructura mapeada por la entidad de dominio y delega su persistencia al repositorio mediante `sensorsRepository.saveData(output)`.

- **`RetrieveDataService` (`getLastSample` / `getHistorySamples`):**
  - **`getLastSample()`:** Retorna la última lectura consolidada del sensor procesada en tiempo real invocando a `findLastData()`. Si no existen registros, el controlador intercepta y retorna un error semántico de tipo `NO_CONTENT`.
  - **`getHistorySamples(period)`:** Calcula los límites de tiempo Unix (`fromTs` y `toTs`) resolviendo el bloque condicional `switch(period)` según el rango solicitado (1h, 6h, 12h, 1d, 3d, 7d) y recupera la colección analítica histórica de la base de datos.

## 5. Restricciones del dominio 

- No accede a base de datos, sistema de archivos, red, HTTP, WebSockets ni ningún protocolo de comunicación.

- No genera timestamps propios (los recibe como parte de ReadingData).

- No maneja la interfaz de usuario ni envía datos al frontend.

- No depende de librerías externas excepto TypeScript estándar y Math.

- No utiliza console.log, console.error ni ninguna salida por consola como parte de su comportamiento normal (solo puede usarse para depuración temporal durante el desarrollo, pero no se debe incluir en la versión final integrada).

- No realiza ninguna operación de entrada/salida (I/O) de ningún tipo.
