# Guía de Configuración del Proyecto

Este documento explica cómo configurar el entorno de desarrollo en tu computadora.
Todos los integrantes del equipo deben seguir estos pasos después de clonar el repositorio.

---

## Prerequisitos

Asegurate de tener instalado lo siguiente antes de comenzar:

| Herramienta        | Versión        | Descarga                                 |
| ------------------ | -------------- | ---------------------------------------- |
| **Node.js**        | 18 o superior  | https://nodejs.org                       |
| **Git**            | Última versión | https://git-scm.com                      |
| **Docker**         | Última versión | https://docs.docker.com/engine/install/  |
| **Docker Compose** | Última versión | https://docs.docker.com/compose/install/ |

Para verificar que están instalados:

```bash
node --version              # debe mostrar v18.x.x o superior
npm --version               # debe mostrar 9.x.x o superior
git --version               # debe mostrar 2.x.x o superior
docker --version            # debe mostrar 29.x.x o superior
docker-compose --version    # debe mostrar 1.x.x o superior
```

---

## Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/ICOMP-UNC/sof-eng-2026-runtime-terror.git
cd sof-eng-2026-runtime-terror
```

### 2. Levantar infraestructura

Con los siguientes comando vamos a levantar la base de datos y el servicio de comunicacion MQTT

```bash
# Vamos al path de docker-compose.yml y ejecutamos:
cd docker
docker compose up -d

# Verificar que los contenedores estén ejecutándose:
docker ps
```

### 3. Instalar dependencias. Arrancar back y front

```bash
cd backend/nestjs
npm install
npm run start
# opcionalemente hacer seed de db aqui

cd ../../frontend/dashboard
npm install
npm run start
```

> En caso que se quieran actualizaciones con los cambios cuando se codea usar la alternativa `dev` en vez de `start`

##### Poblar DB para pruebas

En caso que se quieran hacer pruebas sin tener el ESP32 funcionando, se debe realizar la carga manual de valores al backend, lo cual en este caso se logro publicando valores al topic de MQTT (de esta manera tambien se verifica que el backend funciona bien)

Luego de levantar el backend (estando en el path ./backend/nestjs) correr el siguiente comando:

```bash
npm run mqtt:seed
```

Se puede verificar la carga viendo los logs del backend

---

## Hooks de Git — Validaciones Automáticas

Este proyecto usa **Husky** para correr validaciones automáticas en cada commit y push.
Se instala haciendo install desde la raiz:

```bash
npm install
```

### commit-msg — Validación del mensaje de commit

Cada mensaje de commit es validado contra la convención definida en
[COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md).

**Cómo probarlo:**

```bash
# Mensaje inválido — debe ser RECHAZADO
git commit -m "listo"
# Resultado esperado: ✖ commit rechazado con mensaje de error

# Mensaje válido — debe ser ACEPTADO
git commit -m "feat(SCRUM-1): add initial project setup"
# Resultado esperado: ✔ commit aceptado
```

### pre-commit — Validación del linter

Antes de cada commit, ESLint corre automáticamente sobre el código del backend.
Si hay errores de linting, el commit se bloquea hasta que sean corregidos.
Ya estan instaladas las dependencias si ya hiciste el paso 3.

**Cómo probarlo:**

```bash
# 1. Introducí un error de lint intencional en cualquier archivo .ts
#    dentro de backend/nestjs/src/
#    Por ejemplo, declarar una variable y no usarla:
#    const unused = 'esto va a fallar'

# 2. Intentá hacer un commit
git add .
git commit -m "feat(SCRUM-1): test lint hook"
# Resultado esperado: ✖ commit bloqueado — ESLint encontró errores

# 3. Corregí el error e intentá de nuevo
# Resultado esperado: ✔ commit aceptado
```

> **Importante:**
>
> - Los **errores** de ESLint bloquean el commit
> - Los **warnings** de ESLint NO bloquean el commit
> - El linting aplica actualmente al backend NestJS únicamente

### pre-push — Validación de tests

Antes de cada push, la suite de tests corre automáticamente.
Si algún test falla, el push se bloquea.

**Cómo probarlo:**

```bash
git push origin feature/tu-rama
# Si todos los tests pasan: el push se realiza ✔
# Si algún test falla: el push se bloquea ✖
```

---

## Verificación Final

Corré este checklist después de configurar todo:

```bash
# 1. Husky está activo — debe ser rechazado
git commit -m "listo"

# 2. El linter corre correctamente — debe mostrar 0 errores
cd backend/nestjs && npm run lint

# 3. Los tests corren correctamente — deben pasar todos
cd backend/nestjs && npm test
```

---
