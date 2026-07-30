import { Chart, Plugin } from "chart.js";

const GAP_THRESHOLD_MS = 4 * 60 * 60 * 1000;

export function createGapPlugin(gapIndices: number[]): Plugin {
  return {
    id: "gapMarkers",
    afterDraw(chart: Chart) {
      if (!gapIndices.length) return;
      const ctx = chart.ctx;
      const xAxis = chart.scales.x;
      const yAxis = chart.scales.y;

      ctx.save();
      ctx.strokeStyle = "rgba(239, 68, 68, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);

      for (const idx of gapIndices) {
        const x = xAxis.getPixelForValue(idx);
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.stroke();
      }

      ctx.restore();
    },
  };
}

export function detectGaps(
  samples: { ts_end: string; created_at: string }[],
): number[] {
  const gaps: number[] = [];
  for (let i = 1; i < samples.length; i++) {
    const prev = new Date(samples[i - 1].ts_end || samples[i - 1].created_at).getTime();
    const curr = new Date(samples[i].ts_end || samples[i].created_at).getTime();
    if (curr - prev > GAP_THRESHOLD_MS) {
      gaps.push(i - 0.5);
    }
  }
  return gaps;
}
