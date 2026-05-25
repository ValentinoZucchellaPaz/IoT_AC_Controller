# Guía de Configuración del Proyecto

Este documento explica cómo configurar el entorno de desarrollo en tu computadora.
Todos los integrantes del equipo deben seguir estos pasos después de clonar el repositorio.

---

## Prerequisitos

Asegurate de tener instalado lo siguiente antes de comenzar:

| Herramienta | Versión | Descarga |
|---|---|---|
| **Node.js** | 18 o superior | https://nodejs.org |
| **Git** | Última versión | https://git-scm.com |

Para verificar que están instalados:

```bash
node --version    # debe mostrar v18.x.x o superior
npm --version     # debe mostrar 9.x.x o superior
git --version     # debe mostrar git version 2.x.x
```

---

## Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/ICOMP-UNC/sof-eng-2026-runtime-terror.git
cd sof-eng-2026-runtime-terror
```

### 2. Instalar dependencias de la raíz y activar Husky

Desde la **raíz del proyecto**:

```bash
npm install
```

Este único comando instala todas las dependencias de la raíz y activa automáticamente
los hooks de Git de Husky en tu computadora. No se necesitan pasos adicionales.

### 3. Instalar dependencias del backend

```bash
cd backend/nestjs
npm install
cd ../..
```

---

## Hooks de Git — Validaciones Automáticas

Este proyecto usa **Husky** para correr validaciones automáticas en cada commit y push.
Los hooks se activan automáticamente cuando corrés `npm install` en la raíz (Paso 2).

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