# Runtime Terror — Sistema de Monitoreo y Control de Climatización IoT

**Universidad Nacional de Córdoba** · FCEFyN · Ingeniería de Software 2026

## Acerca del proyecto

Sistema IoT completo que integra un **ESP32** con sensor **DHT11**, un backend **NestJS**, base de datos **PostgreSQL** y un dashboard **Next.js** para monitorear y controlar un aire acondicionado de forma remota.

### Funcionalidades principales

- Lectura de temperatura y humedad ambiente (DHT11)
- Control de temperatura deseada mediante botones físicos (UP/DOWN) en el ESP32
- Control remoto de temperatura deseada vía MQTT desde el dashboard
- Encendido/apagado del aire acondicionado
- Histéresis de ±0.75°C para evitar ciclado del compresor
- Publicación periódica de datos según estado (1 min encendido, 5 min apagado)
- Visualización en tiempo real en dashboard web
- Historial con períodos de eficiencia (HIGH/MEDIUM/LOW)
- Health check de conectividad del dispositivo

## Stack tecnológico

| Capa            | Tecnología                                                     |
| --------------- | -------------------------------------------------------------- |
| Firmware        | PlatformIO, Arduino, DHT11, PubSubClient, ArduinoJson          |
| Backend         | NestJS 11, TypeORM, PostgreSQL, MQTT microservice, Swagger     |
| Frontend        | Next.js 16 (App Router), shadcn/ui, Recharts, Chart.js, Vitest |
| Infraestructura | Docker (postgres:16-alpine, eclipse-mosquitto:2)               |

## Enlaces

- **Repositorio**: https://github.com/ValentinoZucchellaPaz/IoT_AC_Controller
- **Documentación completa**: [docs/](docs/)

---

**Runtime Terror** © 2026 — Proyecto académico FCEFyN - UNC
