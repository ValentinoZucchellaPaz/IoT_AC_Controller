# Firmware ESP32 — Sistema de Climatización IoT

## Stack

- **PlatformIO** con framework Arduino
- **DHT11** para temperatura y humedad
- **PubSubClient** para comunicación MQTT
- **ArduinoJson** para serialización

## Estructura

```
include/          Archivos de cabecera (.h)
src/              Código fuente (.cpp)
  ├── sensors/     Lectura de sensores + botones
  ├── network/     WiFi + MQTT
  └── power/       Gestión de energía
test/             Tests unitarios (GoogleTest)
platformio.ini    Configuración del proyecto
```

## Comandos

```bash
# Compilar
pio run

# Flashear ESP32
pio run -t upload

# Monitor serie
pio device monitor

# Tests unitarios (host, no requiere ESP32)
pio test -e native_test

# Análisis estático
pio check
```

## Configuración

Copiar `include/config_local.example.hpp` → `include/config_local.hpp` y editar:

```cpp
#define WIFI_SSID "tu-red"
#define WIFI_PASSWORD "tu-password"
#define MQTT_BROKER "192.168.x.x"
```

## Documentación relacionada

- [docs/hardware_documentation.md](../../docs/hardware_documentation.md) — pines, cableado y lógica de control
- [docs/topics.md](../../docs/topics.md) — topics MQTT
- [docs/domain_logic.md](../../docs/domain_logic.md) — reglas de negocio (histéresis, frecuencias)
