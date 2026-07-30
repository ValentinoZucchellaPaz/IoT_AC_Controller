# Documentación de Hardware

## Descripción general

Sistema de control de aire acondicionado basado en ESP32. El firmware lee sensores, controla un relay de cooling (LED verde) y se comunica vía MQTT con el backend. También recibe comandos remotos para ajustar la temperatura deseada.

## Componentes

| Componente          | Modelo                      | Función                             |
| ------------------- | --------------------------- | ----------------------------------- |
| Microcontrolador    | ESP32 DevKit                | Ejecuta el firmware principal       |
| Sensor temp/humedad | DHT11                       | Mide temperatura y humedad ambiente |
| Pulsador POWER      | Genérico                    | Encender/apagar el AA (GPIO 4)      |
| Pulsador UP         | Genérico                    | Subir temperatura deseada (GPIO 13) |
| Pulsador DOWN       | Genérico                    | Bajar temperatura deseada (GPIO 14) |
| LED verde           | Externo + resistencia 220Ω  | Simula relay de cooling (GPIO 16)   |
| LED azul            | Integrado en placa (GPIO 2) | Indicador de estado                 |

## Asignación de pines

| Pin ESP32 | Componente        | Función                                  |
| --------- | ----------------- | ---------------------------------------- |
| GPIO 2    | LED integrado     | Indicador de estado (conexión)           |
| GPIO 4    | Pulsador POWER    | Toggle AC on/off (INPUT_PULLUP)          |
| GPIO 13   | Pulsador UP       | Subir temperatura deseada (INPUT_PULLUP) |
| GPIO 14   | Pulsador DOWN     | Bajar temperatura deseada (INPUT_PULLUP) |
| GPIO 16   | LED verde externo | Cooling relay (HIGH = enfriando)         |
| GPIO 27   | DHT11 DATA        | Lectura temperatura/humedad              |

### Botones

Los 3 pulsadores se configuran como `INPUT_PULLUP`:

| Estado                 | Nivel                           |
| ---------------------- | ------------------------------- |
| Normal (no presionado) | HIGH (3.3V por pull-up interno) |
| Presionado             | LOW (conectado a GND)           |

Usan interrupción por flanco descendente + debounce software de 200ms.

### DHT11

| Pin DHT11 | Conexión |
| --------- | -------- |
| VCC       | 3.3 V    |
| DATA      | GPIO 27  |
| GND       | GND      |

### LED verde (GPIO 16)

Refleja el estado del relay de cooling:

- `HIGH` → Aire acondicionado enfriando (compresor activo)
- `LOW` → Aire apagado o en SLEEP

Se apaga inmediatamente cuando el AC pasa a SLEEP.

## Rango de temperatura deseada

Mínimo: **15 °C** — Máximo: **32 °C**

Incremento/decremento de a **1 °C** por pulsación.

## Histéresis

El cooling se activa/desactiva con una banda de histéresis de ±0.75 °C alrededor de la temperatura deseada:

```
Cooling ON  → currentTemp > desiredTemp + 1.5
Cooling OFF → currentTemp < desiredTemp - 1.5
```

(Ancho total de banda: 3 °C)

## DHT11 — Fallback

Si el sensor DHT11 falla (no responde o error de checksum), `readCurrentTemperature()` retorna **30.0 °C** como fallback. Esto permite que el sistema siga funcionando sin un sensor conectado.

## Máquina de estados

### ACTIVE

- AC encendido (`ac_state = true`)
- Muestreo cada ~3 segundos
- Publicación MQTT cada **1 minuto**
- Buffer de hasta 20 muestras por publicación

### SLEEP

- AC apagado (`ac_state = false`)
- Muestreo cada ~15 segundos (heartbeat)
- Publicación MQTT cada **5 minutos**

### Transición

El botón POWER (GPIO 4) cambia de estado. Al cambiar se envían inmediatamente los datos acumulados del estado anterior.

## Comando remoto vía MQTT

El ESP32 se suscribe a `devices/{device_id}/command` y recibe:

```json
{ "desired_temperature": 22.5 }
```

Al recibirlo:

1. Actualiza `desired_temperature` al valor recibido
2. Sincroniza `localDesiredTemperature_` para que el próximo ajuste con botones físicos parta del valor remoto

## Comunicación

- **Wi-Fi**: Modo STA, timeout 30s, reintento periódico cada 30s si se pierde conexión
- **MQTT**: PubSubClient, keepalive 15s, LWT para detectar desconexión
- **NTP**: Sincronización en setup (máx 3 intentos × 5s), no bloquea si no hay WiFi
