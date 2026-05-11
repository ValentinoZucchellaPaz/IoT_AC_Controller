# Especificación de la Lógica de Dominio – Sistema de Control de Aire Acondicionado

Este documento define las reglas de negocio, algoritmos y patrones de diseño que residen en el dominio del sistema. Esta capa representa el modelo lógico del aire acondicionado, diseñado para ser independiente de cualquier detalle de implementación externa (HTTP, base de datos, WebSockets, frontend).

## 1. Entidad principal: ReadingData

El envío de datos se produce cada 1 minuto mientras esté prendido y cada 10 minutos cuando esté apagado.
 
Representa el estado del sistema en un instante de tiempo. Es el objeto básico de intercambio de información. 

- *Atributos:* setpoint (16-30°C), ambientTemp (-10 a 50°C), isOn (boolean), timestamp (Date).

- *Invariantes:* La entidad es autovalidante. Si al intentar crear una instancia algún valor está fuera de rango, se rechaza la construcción (lanzando un error de dominio), asegurando que solo datos válidos fluyan por el sistema.

## 2. Algoritmos de Dominio

- *El ESP32 envía una serie de datos al backend donde se aplican los siguientes algoritmos y puede  devolver o no información al ESP32.* 

### 2.1. Control de Histéresis 

- *Propósito:* Evitar el ciclado corto del compresor (conmutaciones excesivas) ante variaciones mínimas de temperatura.

- *Entrada:* ReadingData actual, estado actual del AC, umbral (default 1.0°C).

- *Salida:* recommendedState (boolean), deadbandActive (boolean).

### 2.2. Detección de anomalía por desviación acumulada(outsider)

- *Propósito:* Identificar si el equipo no está logrando enfriar o calentar según lo esperado, analizando la tendencia.

- *Entrada:* Historial de ReadingData, deviationThreshold (default 2.0°C), estrategia de filtrado (Strategy).

- *Salida:* hasAlert, averageDeviation, anomalyType ("overheat"/"overcool"/"normal").

### 2.3. Estimación de tiempo para alcanzar setpoint

- *Propósito:* Proveer una predicción al usuario sobre cuánto tiempo falta para llegar a la temperatura deseada.

- *Entrada:* Lectura actual, lectura anterior, tiempo transcurrido (minutos).

- *Salida:* minutesRemaining (number|null), trend, confidence.

### 2.4 Algoritmo de Transformacion de Datos

- *Propósito:* Obtener nuevos tipos de datos a partir de los atributos iniciales. 

- *Entrada:* setpoint (16-30°C), ambientTemp (-10 a 50°C), isOn (boolean), timestamp (Date).

- *Salida:* TransformedData(data|null)

## 3. Patrones de Diseño

### 3.1. Observer

Permite que el dominio sea reactivo y extienda su funcionalidad sin modificar el núcleo.

- *Subject:* Mantiene una lista de suscriptores y los notifica cada vez que se procesa una nueva ReadingData.

- *Observer concreto 1 (LoggerObserver):* Almacena en memoria (array de strings) un registro con timestamp y los valores de cada lectura. No escribe en archivos ni en consola como parte de la lógica de negocio.

- *Observer concreto 2 (AlertObserver):* Mantiene un historial en memoria de las últimas N lecturas, ejecuta el algoritmo de detección de anomalía sobre ese historial y, si corresponde, genera alertas (almacenadas en memoria). No persiste ni envía las alertas fuera del dominio.

*Restricción importante:* Los observadores solo trabajan con memoria interna (arrays). No realizan operaciones de persistencia, no envían datos por red, no escriben en archivos ni en la consola del sistema (salvo para depuración temporal durante desarrollo, pero no como parte de la lógica de negocio).

### 3.2. Strategy

Se aplica para dar flexibilidad al procesamiento de los datos históricos.

- *Interfaz:* FilterStrategy { filter(history: ReadingData[]): ReadingData[] }

- *Estrategias concretas:*

- OnlyOnFilter: Procesa únicamente lecturas donde el AC estuvo encendido.

- LastNFilter: Considera solo las últimas N lecturas para cálculos de corto plazo.

- *Uso:* El algoritmo de detección de anomalías utiliza estas estrategias para decidir qué porción del historial es relevante para el análisis actual.

### 3.3. Factory Method  

- *Clase AlertFactory:* Encapsula la lógica de creación de diferentes tipos de alertas detectadas por el sistema.

- *Producto:* Interfaz Alert con atributos message, severity, timestamp.

- *Justificación:* Centraliza la creación de alertas (createOverheatAlert, createOvercoolAlert), evitando que los observadores dependan de las clases concretas de cada mensaje de error. Permite añadir nuevos tipos de alerta sin modificar el AlertObserver.

- *Uso dentro del dominio:* El AlertObserver llama a AlertFactory cuando detecta una anomalía, obteniendo una instancia de Alert sin conocer su implementación concreta.

## 4. Servicio de Dominio 

Es el punto de entrada a la lógica de negocio que coordina las entidades y patrones.

- *processNewReading(reading: ReadingData): ProcessingResult*  

  - Recibe una nueva lectura (asume que ya está validada por su constructor).  

  - Aplica los tres algoritmos usando el historial en memoria y la lectura anterior (si existe).  

  - Almacena la lectura en una base de datos.

  - Notifica a todos los observadores registrados (LoggerObserver y AlertObserver).  

  - Devuelve ProcessingResult (contiene los resultados de los tres algoritmos y la lectura original). 

- *getLiveStatus(): LiveStatus*  

  - Retorna la última lectura almacenada junto con los resultados de los algoritmos recalculados sobre ella (con el historial actual). Si no hay lecturas, retorna null.

- *getHistoryStatus(TimePeriod): HistoryStatus*

  - Retorna los datos especificados en un periodo determinado. 


## 5. Restricciones del dominio 

- No accede a base de datos, sistema de archivos, red, HTTP, WebSockets ni ningún protocolo de comunicación.

- No genera timestamps propios (los recibe como parte de ReadingData).

- No maneja la interfaz de usuario ni envía datos al frontend.

- No depende de librerías externas excepto TypeScript estándar y Math.

- No utiliza console.log, console.error ni ninguna salida por consola como parte de su comportamiento normal (solo puede usarse para depuración temporal durante el desarrollo, pero no se debe incluir en la versión final integrada).

- No realiza ninguna operación de entrada/salida (I/O) de ningún tipo.
