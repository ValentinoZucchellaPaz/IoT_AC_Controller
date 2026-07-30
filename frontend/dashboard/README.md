# Frontend Dashboard — Sistema de Climatización IoT

Dashboard web construido con **Next.js 16** (App Router), **shadcn/ui**, **Recharts** y **Chart.js**.

## Stack

- Next.js 16 (App Router)
- shadcn/ui (componentes)
- Recharts + Chart.js (gráficos)
- Tailwind CSS (estilos)
- Vitest (tests)

## Scripts

```bash
npm run dev      # Servidor de desarrollo (:3001)
npm test         # Tests (Vitest)
npm run build    # Build de producción
```

## Estructura

```
src/
├── app/                  # Páginas (App Router)
├── components/           # Componentes React
│   ├── charts/           # Gráficos (TemperatureChart, HumidityChart)
│   ├── widgets/          # AlertBadge, efficiency, etc.
│   └── ui/               # shadcn/ui components
├── observer/             # Observer pattern (stores)
├── services/             # Llamadas a la API
└── types/                # Tipos TypeScript
```

## Características

- Gráfico de temperatura en tiempo real con línea de temperatura deseada
- Gráfico de humedad
- Barras de eficiencia por período
- Indicador de estado del dispositivo (conectado/desconectado)
- Botón de ayuda (?) en la leyenda de eficiencia con tooltip

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

El frontend redirige `/api/*` → backend via `next.config.js`.

## Documentación relacionada

- [docs/payload.md](../../docs/payload.md) — API REST
- [docs/setup.md](../../docs/setup.md) — Guía de instalación
