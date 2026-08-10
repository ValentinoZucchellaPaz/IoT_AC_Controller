import { Chart, Plugin } from "chart.js";

export interface EfficiencyMeta {
  color: string;
  dotClass: string;
  borderClass: string;
  label: string;
  detail: string;
}

export const EFFICIENCY_META: Record<number, EfficiencyMeta> = {
  0: {
    color: "rgba(239, 68, 68, 0.6)",
    dotClass: "bg-red-400",
    borderClass: "border-red-400",
    label: "Baja",
    detail: "> 30 min",
  },
  1: {
    color: "rgba(251, 191, 36, 0.6)",
    dotClass: "bg-amber-400",
    borderClass: "border-amber-400",
    label: "Media",
    detail: "< 30 min",
  },
  2: {
    color: "rgba(34, 197, 94, 0.6)",
    dotClass: "bg-emerald-400",
    borderClass: "border-emerald-400",
    label: "Alta",
    detail: "< 10 min",
  },
};

const TRACK_HEIGHT = 8;

export interface EfficiencyRange {
  start: number;
  end: number;
  value: number;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export function createEfficiencyPlugin(ranges: EfficiencyRange[]): Plugin {
  return {
    id: "efficiencyBands",
    beforeDatasetsDraw(chart: Chart) {
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;

      const trackBottom = yAxis.bottom - 2;
      const trackTop = trackBottom - TRACK_HEIGHT;
      const trackWidth = xAxis.right - xAxis.left;

      ctx.save();
      ctx.lineJoin = "round";

      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      roundRectPath(ctx, xAxis.left, trackTop, trackWidth, TRACK_HEIGHT, 6);
      ctx.fill();

      if (!ranges.length) {
        ctx.restore();
        return;
      }

      for (const range of ranges) {
        const x1 = xAxis.getPixelForValue(range.start) + 2;
        const x2 = xAxis.getPixelForValue(range.end) - 2;
        if (x2 - x1 < 2) continue;

        const meta = EFFICIENCY_META[range.value] ?? EFFICIENCY_META[1];
        ctx.fillStyle = meta.color;
        roundRectPath(ctx, x1, trackTop + 1, x2 - x1, TRACK_HEIGHT - 2, 4);
        ctx.fill();
      }

      ctx.restore();
    },
  };
}

export function computeEfficiencyRanges(
  samples: { ts_end: string; created_at: string }[],
  periods: { from: string; to: string; efficiency: number }[],
): EfficiencyRange[] {
  const ranges: EfficiencyRange[] = [];

  for (const period of periods) {
    const fromMs = new Date(period.from).getTime();
    const toMs = new Date(period.to).getTime();

    let startIdx = -1;
    let endIdx = -1;

    for (let i = 0; i < samples.length; i++) {
      const t = new Date(samples[i].ts_end || samples[i].created_at).getTime();
      if (startIdx === -1 && t >= fromMs) startIdx = i;
      if (t <= toMs) endIdx = i;
    }

    if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
      ranges.push({ start: startIdx, end: endIdx, value: period.efficiency });
    }
  }

  return ranges;
}

export function buildEfficiencyIndex(
  ranges: EfficiencyRange[],
): Record<number, number> {
  const map: Record<number, number> = {};
  for (const range of ranges) {
    for (let i = range.start; i <= range.end; i++) {
      map[i] = range.value;
    }
  }
  return map;
}
