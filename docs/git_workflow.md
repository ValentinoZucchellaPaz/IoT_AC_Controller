# Workflow Git — Runtime Terror

Este documento define el flujo de trabajo con Git que utiliza el equipo para el desarrollo del proyecto.
Todos los integrantes deben seguir este workflow para garantizar consistencia, trazabilidad y colaboración ordenada dentro del proyecto.

---

## Workflow elegido: Simplified Gitflow

Se eligió **Simplified Gitflow** porque permite trabajar en paralelo sin pisarse, mantener siempre una versión
estable del código y tener trazabilidad clara entre las tareas de Jira y los cambios en el repositorio.

---

## Ramas del proyecto

| Rama | Propósito | ¿Quién escribe? |
|---|---|---|
| `master` | Rama principal estable del proyecto. Contiene versiones validadas y funcionales del sistema. | Nadie pushea directo |
| `development` | Rama de integración principal. Todo el trabajo nuevo termina acá después de revisión. | Nadie pushea directo — solo merge por PR |
| `feature/SCRUM-N-nombre-corto` | Una rama por cada tarea de Jira. Acá se desarrolla la funcionalidad. | El integrante asignado a la tarea |
| `hotfix/SCRUM-N-nombre-corto` | Correcciones urgentes sobre `master` cuando hay un bug crítico. | Solo cuando es estrictamente necesario |

---

## Nomenclatura de ramas

Todas las ramas de trabajo siguen este formato:

```
feature/SCRUM-N-descripcion-corta
```

| Parte | Descripción |
|---|---|
| `feature/` | Prefijo fijo para todas las ramas de desarrollo |
| `SCRUM-N` | Clave de la tarea en Jira (ej: `SCRUM-5`) |
| `descripcion-corta` | 2 a 4 palabras en inglés, separadas por guiones, que describen la tarea |

### Ejemplos válidos

```bash
feature/SCRUM-5-database-migrations
feature/SCRUM-4-esp32-data-ingestion
feature/SCRUM-8-frontend-live-view
feature/SCRUM-6-sensor-reading-repository
hotfix/SCRUM-15-fix-connection-timeout
```

### Ejemplos inválidos

```bash
feature/nueva-funcionalidad        # sin clave Jira
SCRUM-5-database                   # sin prefijo feature/
feature/SCRUM5-database            # falta el guion entre SCRUM y el número
mi-rama                            # sin ningún formato
```

---

## Flujo de trabajo paso a paso

### 1. Tomar una tarea

Entrá a Jira, tomá una tarea del backlog y pasala a **"En progreso"**.
Anotá la clave de la tarea (ej: `SCRUM-5`).

### 2. Crear la rama

Siempre partiendo desde `development` actualizado:

```bash
git checkout development
git pull origin development
git checkout -b feature/SCRUM-5-database-migrations
```

### 3. Desarrollar y commitear

Trabajá en tu rama. Hacé commits siguiendo la convención documentada en
[COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md):

```bash
git add .
git commit -m "feat(SCRUM-5): add sensor_readings migration"
```

### 4. Mantener la rama actualizada

Si `development` recibió cambios mientras trabajabas, actualizá tu rama
para evitar conflictos grandes al momento del PR:

```bash
git fetch origin
git pull origin development
```

### 5. Subir la rama y abrir el Pull Request

```bash
git push origin feature/SCRUM-5-database-migrations
```

Luego en GitHub:
- Tocar en **"Compare & pull request"**
- Verificá que la base sea `development` — nunca `master`
- Título: usá el mismo formato que los commits: `feat(SCRUM-5): add database migrations`
- Descripción: explicá brevemente qué hace el PR y por qué
- Asigná al menos **dos compañeros** como reviewers
- Etiquetá el PR con el label correspondiente (ej: `feature`, `documentation`, `bugfix`)

### 6. Revisión del Pull Request

Los reviewers deben:
- Leer el código y dejar comentarios si algo no está claro o está mal
- Aprobar con **"Approve"** si está correcto
- Solicitar cambios con **"Request changes"** si hay algo que corregir

**Se recomienda contar con al menos 2 revisiones antes de mergear un Pull Request.**

### 7. Merge

Una vez aprobado con las 2 revisiones requeridas:
- Cualquier integrante del equipo puede mergear
- Se mergea usando **Merge Commit** — se preserva el historial completo de desarrollo de cada rama
- El mensaje del merge debe seguir la convención de commits

### 8. Cerrar la tarea en Jira

Después del merge, pasá la tarea en Jira a **"Done"**.

---

## Criterio de merge: Merge Commit 

El equipo usa **Merge Commit** por estas razones:

- Mantener visibles todos los commits realizados durante la tarea
- Conservar trazabilidad detallada del desarrollo
- Facilitar debugging e investigación histórica de cambios


## Relación entre ramas y Jira

| Acción en Git | Acción en Jira |
|---|---|
| Crear rama `feature/SCRUM-N-...` | Pasar tarea a **"En progreso"** |
| Abrir Pull Request | Referenciar la tarea en la descripción del PR |
| Merge a `development` | Pasar tarea a **"Done"** |

Cada rama corresponde a exactamente **una tarea de Jira**.
No se abre una rama para múltiples tareas ni se divide una tarea en múltiples ramas.

---

## Reglas que nunca se rompen

```
❌ Nunca pushear directo a master
❌ Nunca pushear directo a development
❌ Nunca mergear un PR sin las 2 aprobaciones requeridas
❌ Nunca crear una rama sin clave Jira
✅ Siempre partir desde development actualizado
✅ Siempre abrir PR hacia development
✅ Siempre cerrar la tarea en Jira después del merge
✅ Cualquier integrante del equipo puede mergear si tiene las 2 aprobaciones
```

---

## Diagrama general del flujo

```
Jira backlog
     │
     │  tomar tarea SCRUM-N
     ▼
development ──────────────────────────────────────────► master
     │                                        │
     │ git checkout -b feature/SCRUM-N-...    │ merge cuando
     ▼                                        │ hay versión estable
feature/SCRUM-N-...                           │
     │                                        │
     │ commits con convención                 │
     │                                        │
     │ Pull Request → 2 aprobaciones          │
     │ Merge Commit                           │
     └────────────────────────────────────────┘
```

---

## Comandos de referencia rápida

```bash
# Arrancar una tarea nueva
git checkout development && git pull origin development
git checkout -b feature/SCRUM-N-nombre-corto

# Durante el desarrollo
git add .
git commit -m "feat(SCRUM-N): descripción en inglés"

# Actualizar rama con cambios de development
git fetch origin
git pull origin development

# Subir y abrir PR
git push origin feature/SCRUM-N-nombre-corto
# → ir a GitHub y abrir Pull Request hacia development
```

---
