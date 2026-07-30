# Docker — Infraestructura del Proyecto

Servicios para el entorno de desarrollo: **PostgreSQL 16** + **Eclipse Mosquitto 2** (broker MQTT).

## Requisitos

- Docker Engine (o Docker Desktop)
- Docker Compose

## Inicio rápido

```bash
# Desde la raíz del proyecto
cp .env.example .env

# Iniciar servicios
cd docker
docker compose up -d
```

## Servicios

| Servicio | Puerto host | Puerto interno | Credenciales |
|---|---|---|---|
| PostgreSQL | 5433 | 5432 | `soft_eng_user` / `dev_password_2026` / `soft_eng_db` |
| Mosquitto | 1883 | 1883 | Sin autenticación (desarrollo) |

## Comandos útiles

```bash
# Ver estado
docker compose ps

# Logs
docker compose logs -f postgres
docker compose logs -f mosquitto

# Detener (conserva datos)
docker compose down

# Detener y borrar datos
docker compose down -v

# Acceder a PostgreSQL CLI
docker compose exec postgres psql -U soft_eng_user -d soft_eng_db

# Backup
docker compose exec postgres pg_dump -U soft_eng_user soft_eng_db > backup.sql

# Restore
docker compose exec -T postgres psql -U soft_eng_user -d soft_eng_db < backup.sql
```

## Conexión desde el backend NestJS

Las variables se leen del `.env` raíz automáticamente:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=soft_eng_db
POSTGRES_USER=soft_eng_user
POSTGRES_PASSWORD=dev_password_2026
MQTT_URL=mqtt://localhost:1883
```

## pgAdmin (opcional)

Descomentar el servicio `pgadmin` en `docker-compose.yml`, luego:

```
URL: http://localhost:5050
Email: admin@softeng.com
Password: admin
Host: postgres (nombre del servicio Docker)
```

## Solución de problemas

### Puerto 5433 ocupado

```yaml
ports:
  - "5434:5432"   # cambiar en docker-compose.yml
```

Actualizar `POSTGRES_PORT=5434` en `.env`.

### Puerto 1883 ocupado

```yaml
ports:
  - "1884:1883"   # cambiar en docker-compose.yml
```

Actualizar `MQTT_URL=mqtt://localhost:1884` en `.env`.

### Next.js Dashboard (imagen Docker opcional)

```bash
# Desde la raíz del repositorio
docker build -f docker/nextjs.Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000 \
  -t soft-eng-dashboard:latest .

docker run --rm -p 3001:3000 soft-eng-dashboard:latest
```

Requiere tener el frontend compilado. Ver `frontend/dashboard/README.md`.
