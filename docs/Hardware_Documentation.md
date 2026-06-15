# Documentación de Hardware

## Descripción general

Este documento describe el hardware utilizado en el prototipo basado en ESP32 para el sistema de control de aire acondicionado.

El hardware implementado permite al firmware:

* Leer la **temperatura deseada** seleccionada por el usuario mediante un potenciómetro.
* Medir la **temperatura ambiente actual** y la **humedad** usando un sensor DHT11.
* Detectar cambios de estado del aire acondicionado mediante un pulsador.
* Simular la activación del aire acondicionado mediante una salida digital (led de la placa).
* Comunicarse con backend a través de Wi-Fi.

---

# Componentes utilizados

| Componente                      | Modelo                 | Función                                       |
| ------------------------------- | ---------------------- | --------------------------------------------- |
| Microcontrolador                | ESP32 DevKit           | Ejecuta el firmware principal                 |
| Sensor de temperatura y humedad | DHT11                  | Mide temperatura y humedad ambiente           |
| Potenciómetro                   | 10 kΩ                  | Simula la temperatura deseada por el usuario  |
| Pulsador                        | Genérico               | Simula el botón de encendido/apagado del aire |
| LED                             | LED integrado en ESP32 | Indicación de estado                          |

---

# Placa utilizada

Se utiliza una placa de desarrollo **ESP32**.

Características principales:

* Tensión de operación: **3.3 V**
* Conectividad Wi-Fi integrada
* ADC de 12 bits
* Múltiples GPIO configurables

---

# Asignación de pines

| Pin ESP32 | Componente conectado | Función                              |
| --------- | -------------------- | ------------------------------------ |
| GPIO 2    | LED integrado        | Indicación de estado                 |
| GPIO 4    | Pulsador             | Cambio de estado del aire            |
| GPIO 27   | DHT11 (DATA)         | Lectura de temperatura/humedad       |
| GPIO 36   | Potenciómetro        | Entrada ADC para temperatura deseada |

---

# Conexiones

## Sensor DHT11 (módulo de 3 pines)

El módulo DHT11 utilizado posee 3 pines.

| Pin DHT11 | Conexión |
| --------- | -------- |
| VCC       | 3.3 V    |
| DATA      | GPIO 27  |
| GND       | GND      |


---

## Potenciómetro

El potenciómetro se utiliza para representar la temperatura deseada configurada por el usuario.

| Pin del potenciómetro    | Conexión |
| ------------------------ | -------- |
| Extremo 1                | 3.3 V    |
| Terminal central (wiper) | GPIO 36  |
| Extremo 2                | GND      |

Comportamiento esperado:

* ADC = 0 → Temperatura mínima (15 °C)
* ADC = 4095 → Temperatura máxima (32 °C)

Mapeo utilizado:

```text
temperaturaDeseada = 15 + (17 * adc / 4095)
```

---

## Pulsador

El pulsador permite cambiar entre los estados del sistema.

| Pin del pulsador | Conexión |
| ---------------- | -------- |
| Un terminal      | GPIO 4   |
| Otro terminal    | GND      |

Configuración utilizada:

* GPIO configurado como `INPUT_PULLUP`
* Estado normal: HIGH
* Pulsado: LOW

El firmware utiliza una interrupción por flanco descendente (*falling edge*).

---

## LED

Se utiliza el LED integrado de la placa para indicar el estado del sistema.

| LED           | GPIO   |
| ------------- | ------ |
| LED integrado | GPIO 2 |

Comportamiento:

* Encendido → Modo aire prendido
* Apagado → Modo aire apagado

---

# Maquina de estados

El sistema implementa dos estados principales.

---

## ACTIVE

En este estado:

* El aire acondicionado esta encendido
* Se muestra temperatura deseada y medida cada 3 segundos
* Se envia data al backend cada 1 minuto

---

## SLEEP

En este estado:

* El aire acondicionado esta apagado
* Se muestra temperatura deseada y medida cada 15 segundos
* Se envia data al backend cada 5 minutos

---

### Metodo para cambiar de estado

* El cambio de un estado al otro se da apretando el boton del pin 4 
* En cada cambio de estado se envia informacion con los ultimos datos recolectados en el estado actual

---

# Muestreo de sensores

El firmware realiza muestreo periódico de sensores.

Cada muestra contiene:

* Temperatura deseada (potenciómetro)
* Temperatura actual (DHT11)
* Humedad actual (DHT11)

---

# Buffer de muestras

Las muestras de temperatura deseada y medida se almacenan en buffers internos.

Capacidad máxima:

```text
20 muestras
```

Cuando el buffer se llena:

1. Los datos quedan listos para enviarse al backend
2. Se reinicia el contador de muestras válidas
3. El sistema vuelve a almacenar desde la posición 0

---

# Comunicación con Backend

El ESP32 se comunica con el backend mediante MQTT usando Wi-Fi.

Información transmitida:

Respecto a la adquisicion de datos:
* Device ID
* Temperaturas deseadas
* Temperaturas medidas
* Humedad actual
* Cantidad de muestras válidas
* Timestamp
* Estado del aire acondicionado

Respecto a la conectividad de la ESP32:
* Device ID
* Estado de conexion de la placa con respecto al backend
Esta ultima información se transmitirá cuando la placa pierda algun tipo de conexion (ya sea la conexion a Wi-Fi, MQTT o energía) y cuando recupere la conexión que haya perdido

---

# Posibles extensiones futuras

El hardware puede ampliarse incorporando:

* Módulo relay para controlar un aire real
* Pantalla LCD / OLED
* Sensor de corriente para medir consumo energético
