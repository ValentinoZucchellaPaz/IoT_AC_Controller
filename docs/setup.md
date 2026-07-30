# Guía de Configuración del Proyecto

## Prerrequisitos

| Herramienta | Versión | Descarga |
|---|---|---|
| **Node.js** | 22 LTS | https://nodejs.org (o `nvm install` en cada subproyecto) |
| **Docker** | Última | https://docs.docker.com/engine/install/ |
| **Docker Compose** | Última | (incluido con Docker Desktop) |
| **Git** | Última | https://git-scm.com |
| **PlatformIO** | Última | `pip install platformio` |

Verificar instalación:

```bash
node --version       # v22.x.x
npm --version        # 10.x.x
docker --version
docker compose version
git --version
pio --version
```

## Configuración Inicial

### 1. Clonar y configurar variables de entorno

```bash
git clone https://github.com/ICOMP-UNC/sof-eng-2026-runtime-terror.git
cd sof-eng-2026-runtime-terror
cp .env.example .env
```

### 2. Levantar infraestructura (PostgreSQL + MQTT)

```bash
cd docker
docker compose up -d
docker compose ps
```

Ambos servicios deberían aparecer como "Up":
- `soft-eng-postgres` (puerto 5433)
- `soft-eng-mosquitto` (puerto 1883)

### 3. Backend NestJS

```bash
cd backend/nestjs
nvm use                    # asegurar Node 22
npm install
npm run dev                # http://localhost:3000
```

Swagger disponible en http://localhost:3000/api

### 4. Frontend Dashboard

```bash
cd frontend/dashboard
cp .env.example .env
nvm use
npm install
npm run dev                # http://localhost:3001
```

### 5. Poblar base de datos con datos de prueba (opcional)

```bash
cd backend/nestjs
npm run mqtt:seed
```

Esto publica mensajes MQTT falsos al topic `sensor/datos` simulando un ESP32. Se puede verificar en los logs del backend.

### 6. Firmware ESP32

```bash
cd firmware/esp32
cp include/config_local.example.hpp include/config_local.hpp
# Editar config_local.hpp con SSID, password y dirección del broker MQTT
pio run -t upload          # flashear ESP32
pio device monitor         # ver logs por serie
```

## Hooks de Git (Husky)

Se activan automáticamente al hacer `npm install` en la raíz del proyecto:

```bash
# Desde la raíz del repositorio
npm install
```

- **commit-msg**: valida formato `<tipo>(SCRUM-N): descripción`
- **pre-commit**: ejecuta ESLint sobre el backend NestJS
- **pre-push**: ejecuta `npm run build` en el backend

## Verificación

```bash
cd backend/nestjs && npm run lint && npm test
cd frontend/dashboard && npm test
```

## Puertos y conexiones

| Servicio | Puerto host |
|---|---|
| PostgreSQL | 5433 |
| MQTT (Mosquitto) | 1883 |
| Backend NestJS | 3000 |
| Frontend Next.js | 3001 |
