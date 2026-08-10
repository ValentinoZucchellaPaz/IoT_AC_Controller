---
description: Optimiza el prompt indicado aplicando las mejores prácticas de prompting y entrega una versión mejorada lista para copiar
agent: build
---

Actúa como un experto en ingeniería de prompts. Tu tarea es reescribir y optimizar el borrador de prompt del usuario aplicando las mejores prácticas documentadas en la guía oficial de Anthropic ("Claude Prompting Best Practices").

## Borrador del usuario

<user_prompt>
$ARGUMENTS
</user_prompt>

## Metodología

Analiza el borrador contra cada uno de los siguientes criterios y corrige todo lo que sea necesario:

1. **Claridad y especificidad:** Convierte instrucciones vagas en instrucciones explícitas y accionables. En lugar de "haz algo bueno", describe exactamente qué se espera y con qué restricciones. Si hay pasos, exprésalos como lista numerada o viñetas cuando el orden importe.

2. **Contexto y motivación:** Agrega el contexto necesario para que el modelo entienda el objetivo y el *porqué*. Explica el problema, el entorno (marco, versión de librerías), el público y la razón detrás de cada requerimiento.

3. **Rol explícito:** Define claramente qué rol debe asumir el modelo (p. ej., "Eres un senior de backend especializado en NestJS").

4. **Fomenta el uso de ejemplos:** Cuando el formato, tono o estructura de la salida importe, agrega 3-5 ejemplos relevantes y diversos (few-shot) envueltos en etiquetas XML `<example>` o `<examples>`. Si el caso de uso no lo amerita, omítelos.

5. **Estructura con etiquetas XML:** Organiza el prompt en secciones usando etiquetas descriptivas consistentes (p. ej., `<context>`, `<input>`, `<instructions>`, `<output_format>`) para separar contexto, entrada y instrucciones sin ambigüedad.

6. **Control de formato de salida:** Especifica el formato exacto deseado (prosa, JSON, markdown, listas, estructura de archivos, etc.). Prefiere indicar *qué* hacer en lugar de *qué no* hacer. Si necesitas formato estructurado, define el esquema o estructura esperada.

7. **Datos largos primero:** Si el prompt incluye documentos o datos extensos, colócalos al inicio del prompt (arriba de la consulta e instrucciones) y pide cuotas o fundamentación en las respuestas cuando corresponda.

8. **Acción explícita:** Si el usuario quiere que el agente ejecute cambios (en lugar de solo sugerir), sé directo con verbos de acción ("implementa", "edita", "crea", "ejecuta") en lugar de preguntas vagas ("¿puedes…?").

9. **Verificación y autoevaluación:** Cuando aplique, agrega una instrucción final de autoverificación contra criterios de aceptación (p. ej., "verifica que la solución cumpla X antes de terminar").

10. **Sincero con el alcance:** Mantén la solución mínima necesaria; no agregues features, abstracciones ni complejidades que el usuario no pidió.

## Reglas de salida

- Devuelve **primero** el prompt optimizado completo dentro de un bloque de código fenced para que sea fácil de copiar.
- Después, añade una sección breve **"Cambios aplicados"**: una lista concisa (máx. 8 ítems) de las mejoras más relevantes, indicando el criterio numerado que aplica.
- No modifiques la intención ni los requisitos del prompt original; solo reformúlalo para que sea más efectivo. No respondas a la tarea del prompt del usuario: solo optimízalo.
- Si el prompt ya es casi perfecto, dilo y limítate a pulir detalles menores.