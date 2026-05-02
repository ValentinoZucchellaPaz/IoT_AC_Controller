# Convención de Commits

Este proyecto sigue la especificación [Conventional Commits](https://www.conventionalcommits.org/),
extendida con una clave de Jira obligatoria para garantizar trazabilidad entre los commits y las tareas del backlog.

---

## Regla General

```
<tipo>(<CLAVE-JIRA>): <descripción corta>
```

| Parte | Descripción |
|---|---|
| `tipo` | Naturaleza del cambio. Ver tipos permitidos abajo. |
| `CLAVE-JIRA` | Obligatorio. La clave de la tarea de Jira asociada (ej: `SCRUM-4`). |
| `descripción corta` | En inglés, modo imperativo, minúsculas, sin punto al final. |
---

## Tipos Permitidos

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de un bug |
| `docs` | Cambios solo en documentación |
| `test` | Agregar o modificar tests |
| `chore` | Configuración, dependencias, archivos de build |
| `refactor` | Cambio de código que no agrega funcionalidad ni corrige bug |
| `style` | Formato, espacios, punto y coma — sin cambio de lógica |
| `ci` | Cambios en el pipeline de CI/CD |

---

## Reglas Adicionales

- La descripción **debe estar en inglés**.
- Usar **modo imperativo**: `add`, `fix`, `update` — no `added`, `fixed`, `updated`.
- **Sin mayúscula** al inicio de la descripción.
- **Sin punto** al final.
- Cada commit **debe referenciar una clave Jira válida**.
- Los commits que no respeten esta convención serán **rechazados automáticamente** por el hook de Husky configurado en el proyecto.

---

## Ejemplos Válidos

```bash
# SCRUM-3: Se definió el payload entre ESP32 y backend
feat(SCRUM-3): add POST /api/data endpoint with ESP32 payload validation

# SCRUM-8: Se crearon las vistas del frontend con datos mock
feat(SCRUM-8): add live view and history view with mock data

# Ejemplo de corrección de bug
fix(SCRUM-7): resolve database connection timeout on cold start

# Ejemplo de documentación
docs(SCRUM-1): add ESP32 wiring diagram and sensor pin reference

# Ejemplo de tests
test(SCRUM-6): add unit tests for Sensor
```

---

## Ejemplos Inválidos

```bash
# Sin clave Jira
feat: add endpoint to receive ESP32 data

# Descripción en español
feat(SCRUM-4): agregar endpoint para recibir datos del ESP32

# Tiempo pasado en lugar de imperativo
feat(SCRUM-4): added endpoint to receive ESP32 data

# Mayúscula al inicio
feat(SCRUM-4): Add endpoint to receive ESP32 data

# Sin tipo
SCRUM-4: add endpoint to receive ESP32 data

#  Descripción vacía o vaga
fix(SCRUM-7): fix bug
fix(SCRUM-7): listo
fix(SCRUM-7): cambios
```

---

## Configuración en cada computadora (Husky + Commitlint)

El proyecto usa **Husky** para ejecutar validaciones automáticas antes de cada commit.
Husky se instala automáticamente al hacer `npm install` dentro de `backend/nestjs/`.

### Pasos para cada integrante del equipo

**1. Clonar el repositorio** 
```bash
git clone https://github.com/tu-usuario/soft-eng-2026-final-project.git
cd soft-eng-2026-final-project
```

**2. Instalar dependencias en la raiz** (esto activa Husky automáticamente) 
Requisito: Tener instalado Node 
```bash
npm install
```

**3. Verificar que Husky esté funcionando**
```bash
# Intentá hacer un commit con mensaje inválido — debe ser rechazado
git commit -m "listo"
# Resultado esperado: ✖ commit rechazado con mensaje de error

# Intentá con un mensaje válido — debe funcionar
git commit -m "feat(SCRUM-1): add initial project setup"
# Resultado esperado: ✔ commit aceptado
```
## Tarjeta de referencia rápida

```
feat(SCRUM-N): lo que agregaste
fix(SCRUM-N): lo que corregiste
docs(SCRUM-N): lo que documentaste
test(SCRUM-N): lo que testeaste
chore(SCRUM-N): lo que configuraste
refactor(SCRUM-N): lo que reestructuraste
```
---